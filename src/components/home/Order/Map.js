import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
  StandaloneSearchBox,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { setTransport, setUser, setVehicle } from '../../../redux/user';
import { setLoading } from '../../../redux/application';

const Map = ({ isLoaded }) => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.loja.language);
  const vehicle = useSelector((state) => state.user.vehicle);
  const transport = useSelector((state) => state.user.transport);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [request, setRequest] = useState(null);
  const [shouldRequestRoute, setShouldRequestRoute] = useState(false);
  const [pickUpInputValue, setPickUpInputValue] = useState(vehicle.pickUp?.address || "");
  const [destinationInputValue, setDestinationInputValue] = useState(vehicle.destination?.address || "");
  const pickUpRef = useRef(null);
  const destinationRef = useRef(null);
  const getCenter = () => {
    const pickUp = vehicle?.pickUp?.coordinates;
    const destination = vehicle?.destination?.coordinates;
  
    const validCoords = (coords) =>
      Array.isArray(coords) &&
      coords.length === 2 &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number" &&
      !isNaN(coords[0]) &&
      !isNaN(coords[1]);
  
    if (validCoords(pickUp) && validCoords(destination)) {
      const midLat = (pickUp[1] + destination[1]) / 2;
      const midLng = (pickUp[0] + destination[0]) / 2;
      return { lat: midLat, lng: midLng };
    }
  
    // Default to Almada
    return { lat: 38.6802, lng: -9.1582 };
  };
  
  const center = getCenter();
  
  

  const t = (pt, en) => (language === "pt" ? pt : en);
  const storedRoutePathRef = useRef([]);

  useEffect(() => {
    setPickUpInputValue(vehicle.pickUp?.address || "");
    setDestinationInputValue(vehicle.destination?.address || "");
  }, [vehicle.pickUp?.address, vehicle.destination?.address]);

  const handleMarkerDragEnd = (e, target) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const coordinates = [lng, lat];

    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(lat, lng);

    const getStructuredAddress = (results) => {
      for (let result of results) {
        const hasStreet = result.address_components.some(comp =>
          comp.types.includes("route")
        );
        const hasNumber = result.address_components.some(comp =>
          comp.types.includes("street_number")
        );

        if (hasStreet && hasNumber) {
          return result.formatted_address;
        }
      }

      return results[0].formatted_address;
    };

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = getStructuredAddress(results);

        if (target === "pickUp") {
          const updated = { ...vehicle.pickUp, coordinates, address };
          dispatch(setVehicle({ ...vehicle, pickUp: updated }));
          calculatePrice(updated, vehicle.destination);
          prepareRequest(updated.coordinates, vehicle.destination.coordinates);
        } else if (target === "destination") {
          const updated = { ...vehicle.destination, coordinates, address };
          dispatch(setVehicle({ ...vehicle, destination: updated }));
          calculatePrice(vehicle.pickUp, updated);
          prepareRequest(vehicle.pickUp.coordinates, updated.coordinates);
        }
      } else {
        console.error("Geocode failed: " + status);
      }
    });

    setShouldRequestRoute(true);
  };

  const handleOnPlacesChange = (target) => {
    const pickUpAddress = pickUpRef.current?.getPlaces?.();
    const destinationAddress = destinationRef.current?.getPlaces?.();

    if (target === "pickUp" && pickUpAddress?.[0]) {
      const location = pickUpAddress[0].geometry.location;
      const coordinates = [location.lng(), location.lat()];
      const updated = { address: pickUpAddress[0].formatted_address, coordinates };
      dispatch(setVehicle({ ...vehicle, pickUp: updated }));
      prepareRequest(coordinates, vehicle.destination.coordinates);
    }

    if (target === "destination" && destinationAddress?.[0]) {
      const location = destinationAddress[0].geometry.location;
      const coordinates = [location.lng(), location.lat()];
      const updated = { address: destinationAddress[0].formatted_address, coordinates };
      dispatch(setVehicle({ ...vehicle, destination: updated }));
      prepareRequest(vehicle.pickUp.coordinates, coordinates);
    }

    setShouldRequestRoute(true);
  };

  const prepareRequest = (pickUpCoordinates, destinationCoordinates) => {
    if (!pickUpCoordinates || !destinationCoordinates) return;

    const origin = { lat: pickUpCoordinates[1], lng: pickUpCoordinates[0] };
    const dest = { lat: destinationCoordinates[1], lng: destinationCoordinates[0] };

    setRequest({
      origin,
      destination: dest,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setShouldRequestRoute(true);
  };

  useEffect(() => {
    if (shouldRequestRoute && vehicle.pickUp.coordinates && vehicle.destination.coordinates) {
      prepareRequest(vehicle.pickUp.coordinates, vehicle.destination.coordinates);
    }
  }, [shouldRequestRoute, vehicle.pickUp.coordinates, vehicle.destination.coordinates]);

  useEffect(() => {
    if (vehicle.pickUp.coordinates && vehicle.destination.coordinates) {
      prepareRequest(vehicle.pickUp.coordinates, vehicle.destination.coordinates);
    }
  }, [vehicle.pickUp.coordinates,vehicle.destination.coordinates]);

  const calculatePrice = (pickUp, destination) => {
    if (!pickUp?.coordinates || !destination?.coordinates) {
      alert(t("Por favor, selecione o local de retirada e o destino.", "Please select both pickup and destination."));
      return;
    }

    dispatch(setLoading(true));

    const directionsService = new window.google.maps.DirectionsService();

    const origin = new window.google.maps.LatLng(pickUp.coordinates[1], pickUp.coordinates[0]);
    const dest = new window.google.maps.LatLng(destination.coordinates[1], destination.coordinates[0]);

    directionsService.route(
      {
        origin,
        destination: dest,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          const route = result.routes[0].legs[0];
          const distance = route.distance.text;
          const duration = route.duration.text;
          const distanceValue = route.distance.value / 1000;
          const price = Math.max(32, distanceValue * 1.2).toFixed(2);

          dispatch(setTransport({
            distancia: distance,
            duracao: duration,
            preco: price,
          }));
        } else {
          console.error("Directions request failed due to", status);
          alert(t("Não foi possível calcular a rota.", "Failed to calculate route."));
        }

        dispatch(setLoading(false));
      }
    );
  };
  let storedRoutePath =[]

  useEffect(() => {
    if (directionsResponse) {
      storedRoutePathRef.current =
        vehicle.directions?.map((point) => ({
          lat: point.lat,
          lng: point.lng,
        })) || [];
    }
  }, [directionsResponse, vehicle]);
  


  return (
    <>
      {isLoaded ? (
        <>
          <div className="relative flex flex-col items-center space-y-1">
            <div className="w-full">
            
              <StandaloneSearchBox
                onLoad={(ref) => (pickUpRef.current = ref)}
                onPlacesChanged={() => handleOnPlacesChange("pickUp")}
              >
                <input
                  value={pickUpInputValue}
                  onChange={(e) => setPickUpInputValue(e.target.value)}
                  placeholder={t("Digite o local de retirada", "Enter pickup location")}
                  className="input m-0 w-full py-1 px-4 rounded-lg border border-gray-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  style={{ height: "50px" }}
                />
              </StandaloneSearchBox></div>
       
{transport.selectedService==="Transporte"&&
            <div className="w-full ">
    
              <StandaloneSearchBox
                onLoad={(ref) => (destinationRef.current = ref)}
                onPlacesChanged={() => handleOnPlacesChange("destination")}
              >
                <input
                  value={destinationInputValue}
                  onChange={(e) => setDestinationInputValue(e.target.value)}
                  placeholder={t("Digite o destino", "Enter destination")}
                  className="input w-full py-1 px-4 rounded-lg border border-gray-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  style={{ width: "100%",height: "50px" }}
                />
              </StandaloneSearchBox>
          </div>}
              <div className="w-full mt-6">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "270px" , border: "rounded"}}
                  center={center}
                  zoom={12}
                  options={{
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    disableDefaultUI: true,
                  }}
                >   {vehicle.pickUp.coordinates && (
                    <Marker
                      position={{ lat: vehicle.pickUp.coordinates[1], lng: vehicle.pickUp.coordinates[0] }}
                      draggable
                      onDragEnd={(e) => handleMarkerDragEnd(e, "pickUp")}
                    />
                  )}
                  {request && shouldRequestRoute && (
                    <DirectionsService
                      options={request}
                      callback={(res, status) => {
                        if (status === "OK") {
                          setDirectionsResponse(res);
                          const plainPath = res.routes[0].overview_path.map(p => ({
                            lat: p.lat(),
                            lng: p.lng()
                          }));
                          dispatch(setUser({ field: "vehicle.directions", value: plainPath }));                        
                          setShouldRequestRoute(false);
                        } else {
                          console.error("Directions request failed:", status);
                          setShouldRequestRoute(false);
                        }
                      }}
                    />
                  )}
                    {storedRoutePath.length > 0 && (
                      <Polyline
                        path={storedRoutePath}
                        options={{
                          strokeColor: "#FF0000", // red route for example
                          strokeOpacity: 0.8,
                          strokeWeight: 4,
                        }}
                      />
                    )}

                  {directionsResponse && (
                    <DirectionsRenderer
                      directions={directionsResponse}
                      options={{ suppressMarkers: true }}
                    />
                  )}

                  {vehicle.destination.coordinates && (
                    <Marker
                      position={{ lat: vehicle.destination.coordinates[1], lng: vehicle.destination.coordinates[0] }}
                      draggable
                      onDragEnd={(e) => handleMarkerDragEnd(e, "destination")}
                    />
                  )}
                </GoogleMap>
              </div>
          </div>
        </>
      ) : (
        <div className="text-center text-lg font-semibold py-6">Loading Google Maps...</div>
      )}

    </>
  );
};

export default Map;
