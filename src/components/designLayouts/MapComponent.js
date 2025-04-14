import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { clearRoute, setCurrentOrder, clearCurrentOrder, setState } from "../../redux/driver";
import { customFetch } from "../../utils/customFetch";
import { io } from "socket.io-client";
import { AiOutlineClose } from "react-icons/ai";
const socket = io(process.env.REACT_APP_SOCKET_URL, { transports: ['websocket'] });

const containerStyle = {
  width: "auto",
  height: "350px",
  marginLeft: "10px",
  marginRight: "10px",
  overflow: "hidden",
};

const haversineDistance = (coord1, coord2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371e3;

  const φ1 = toRad(coord1.lat);
  const φ2 = toRad(coord2.lat);
  const Δφ = toRad(coord2.lat - coord1.lat);
  const Δλ = toRad(coord2.lng - coord1.lng);

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const splitRoute = (driverPos, path) => {
  if (!driverPos || path.length === 0) return { past: [], future: path };

  let closestIndex = 0;
  let minDistance = Infinity;

  path.forEach((point, index) => {
    const dist = haversineDistance(driverPos, point);
    if (dist < minDistance) {
      closestIndex = index;
      minDistance = dist;
    }
  });

  return {
    past: path.slice(0, closestIndex),
    future: path.slice(closestIndex),
  };
};

const MapComponent = () => {
  const dispatch = useDispatch();
  const driver = useSelector((state) => state.driver);
  const [directions, setDirections] = useState([]);
  const task = driver.currentOrder;
  const rawDirections = driver.currentOrder?.vehicle?.directions;
  const route = Array.isArray(rawDirections) ? rawDirections : Object.values(rawDirections || {});
  const storedRoutePath = route?.map((point) => ({ lat: point.lat, lng: point.lng })) || [];

  const destinationCoords = task?.destination?.location?.coordinates;
  const destinationPointCenter = destinationCoords && destinationCoords.length === 2 && !isNaN(destinationCoords[0]) && !isNaN(destinationCoords[1])
    ? { lat: destinationCoords[1], lng: destinationCoords[0] }
    : { lat: 37.7749, lng: -8.4194 };

  const token = localStorage.getItem("token");
  const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_KEY });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const taskIsValid = task && typeof task === "object" && Object.keys(task).length > 0;
    setIsOpen(taskIsValid);
  }, [task]);

  const center = {
    lat: driver?.location?.lat,
    lng: driver?.location?.lng
  };

  const pickup = driver?.currentOrder?.pickup?.location?.coordinates;
  const pickupLatLng = pickup ? { lat: pickup[1], lng: pickup[0] } : null;

  const calculateRoute = (map) => {
    if (!pickupLatLng) return;

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({ map });

    directionsService.route(
      {
        origin: center,
        destination: pickupLatLng,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          setDirections(result.routes[0].overview_path);
        }
      }
    );
  };

  const update_route = async (newRoute) => {
    const taskId = task._id;
    const path = newRoute.map((p) => ({ lat: p.lat(), lng: p.lng() }));
    const newVehicle = {
      ...task.vehicle,
      directions_to_get_costumer: path,
    };
    try {
      await customFetch("PATCH", token, { vehicle: newVehicle }, `driver/order/${taskId}`);
    } catch (error) {
      console.error("Error updating route:", error);
    }
  };

  const sendRoute = (taskId, route) => {
    socket.emit("sendRoute", { orderId: taskId, route: route });
  };

  const fetchEmitState = async (task, newState) => {
    const taskId = task._id;
    try {
      await customFetch("PATCH", token, { state: newState }, `driver/order/${taskId}`);
      socket.emit("updateOrderState", { taskId, state: newState });
      dispatch(setState({ _id: taskId, state: newState }));
      if (newState === "accepted") {
        update_route(directions);
        sendRoute(taskId, directions);
      }
      dispatch(clearRoute());
    } catch (error) {
      console.error("Error updating pickup:", error);
    }
  };

  const changeStateAndEmit = ({ task, newState }) => {
    const taskId = task._id;
    fetchEmitState(task, newState);
    socket.emit("updateOrderState", { taskId, newState });
    dispatch(setCurrentOrder(task));
  };

  const closeModal = () => {
    setIsOpen(false);
    dispatch(clearCurrentOrder());
  };

  const driverPosition = {
    lat: driver.location?.coordinates?.[1],
    lng: driver.location?.coordinates?.[0],
  };

  const { past, future } = splitRoute(driverPosition, storedRoutePath);

  if (!isOpen || !isLoaded) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Delivery Route</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <AiOutlineClose size={22} />
          </button>
        </div>

        {task.state !== "finalized" && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={17}
            onLoad={(map) => calculateRoute(map)}
          >
            {driver?.location && <Marker position={center} />}
            {driver?.location && <Marker position={destinationPointCenter} label={"C"} />}

            {/* Faded past route */}
            {past.length > 0 && (
              <Polyline
                path={past}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.3,
                  strokeWeight: 4,
                }}
              />
            )}

            {/* Solid future route */}
            {future.length > 0 && (
              <Polyline
                path={future}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.9,
                  strokeWeight: 4,
                }}
              />
            )}
          </GoogleMap>
        )}

        <div className="p-4 space-y-4">
          <div className="text-sm text-gray-600">
            <strong>Pickup:</strong> {task?.pickup?.address}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-green-600 text-xl font-bold">
              ${task.price?.toFixed(2)}
            </span>
            <div className="flex gap-2">
              {task.state === "pending" && (
                <button
                  onClick={() => changeStateAndEmit({ task, newState: "accepted" })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                >
                  Accept
                </button>
              )}
              {task.state === "accepted" && (
                <button
                  onClick={() => changeStateAndEmit({ task, newState: "pickup" })}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow"
                >
                  Pick Up
                </button>
              )}
              {task.state === "pickup" && (
                <button
                  onClick={() => changeStateAndEmit({ task, newState: "dropoff" })}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow"
                >
                  Drop Off
                </button>
              )}
              {task.state === "dropoff" && (
                <button
                  onClick={() => changeStateAndEmit({ task, newState: "finalized" })}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
                >
                  Finalize
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
