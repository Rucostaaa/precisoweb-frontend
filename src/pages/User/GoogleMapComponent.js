import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { useSelector } from "react-redux";
import { GOOGLE_MAPS_API_OPTIONS } from "../../utils/loader";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL, { transports: ['websocket'] });

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
  overflow: "hidden",
  margin: "auto",
};

const GoogleMapComponent = () => {
  const user = useSelector((state) => state.user);
  const currentOrder = user?.currentOrder;

  const userLocation = currentOrder?.pickup?.location?.coordinates || null;
  const userDestination = currentOrder?.destination?.location?.coordinates || null;
  const driverLocation = currentOrder?.driver?.location?.coordinates || null;

  const dbMainRoute = currentOrder?.vehicle?.directions || [];

  const [socketRoute, setSocketRoute] = useState( currentOrder?.vehicle?.directions_to_get_costumer || []);

  const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_API_OPTIONS);

  useEffect(() => {
    if (currentOrder?._id && user) {
      socket.emit("joinOrder", { orderId: currentOrder._id, user });
    }

    socket.on("driverSentRoute", ({ route }) => {
      console.log("Received route from socket:", route);
      setSocketRoute(route);
      
    });

    return () => {
      socket.off("driverSentRoute");
    };
  }, [currentOrder, user]);

  const center = userLocation
    ? { lat: userLocation[1], lng: userLocation[0] }
    : { lat: 40.7128, lng: -74.006 }; // fallback

  const transformRoute = (coords) =>
    coords.map(({ lat, lng }) => ({ lat, lng }));



  return isLoaded ? (
    <div className="w-full max-w-4xl h-[260px] m-auto mb-2 p-4 shadow-lg rounded-lg overflow-hidden">
      <div className="grid h-[100%]">
        {userLocation && driverLocation ? (
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
            {/* Markers */}
            <Marker position={{ lat: userLocation[1], lng: userLocation[0] }} label="A" />
            <Marker position={{ lat: userDestination[1], lng: userDestination[0] }} label="B" />
            <Marker position={{ lat: driverLocation[1], lng: driverLocation[0] }} label="M" />

            {/* Green route: directions to pickup */}
            {socketRoute.length > 0 && (
              <Polyline
                path={transformRoute(socketRoute)}
                options={{
                  strokeColor: "#00FF00", // green
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                }}
              />
            )}

            {/* Blue route: full route (socket or DB) */}
            {dbMainRoute.length > 0 && (
              <Polyline
                path={transformRoute(dbMainRoute)}
                options={{
                  strokeColor: "#0000FF", // blue
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <p className="text-center text-gray-600">Waiting for location data...</p>
        )}
      </div>
    </div>
  ) : (
    <p className="text-center text-gray-600">Loading Map...</p>
  );
};

export default GoogleMapComponent;
