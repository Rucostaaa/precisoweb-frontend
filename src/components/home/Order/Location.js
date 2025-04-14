import { useJsApiLoader } from '@react-google-maps/api';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../../redux/application';
import { setTransport, setUser } from '../../../redux/user';
import Map from './Map';
import { FaLifeRing, FaTools, FaTruckPickup } from 'react-icons/fa';
import { MdLocalCarWash } from 'react-icons/md';

const Location = ({ handleNext }) => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.loja.language);
  const [directions, setDirections] = useState(null);
  const vehicle = useSelector((state) => state.user.vehicle);
  const transport = useSelector((state) => state.user.transport);

  const loading = useSelector((state) => state.application.loading);
  const { preco } = useSelector((state) => state.user.transport);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const selectedService=transport?.selectedService;
console.log(transport);

  const mapLoaderOptions = {
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
    language: "pt",
    region: "pt",
  };

  const { isLoaded } = useJsApiLoader(mapLoaderOptions);

  const t = (pt, en) => language === "pt" ? pt : en;

  const calculatePrice = () => {
    if (!vehicle.pickUp.coordinates || !vehicle.destination.coordinates) {
      alert(t("Por favor, selecione o local de retirada e o destino.", "Please select both pickup and destination."));
      return;
    }

    dispatch(setLoading(true));
    setShowPriceDetails(true);

    const directionsService = new window.google.maps.DirectionsService();
    const origin = new window.google.maps.LatLng(vehicle.pickUp.coordinates[1], vehicle.pickUp.coordinates[0]);
    const destination = new window.google.maps.LatLng(vehicle.destination.coordinates[1], vehicle.destination.coordinates[0]);

    directionsService.route(
      {
        origin,
        destination,
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
          setDirections(result);
          setShowPriceDetails(true);
        } else {
          console.error("Directions request failed due to ", status);
          alert(t("Não foi possível calcular a rota.", "Failed to calculate route."));
        }

        dispatch(setLoading(false));
      }
    );
  };

  return (
    <div className="space-y-6 m-0 px-2 sm:px-1 md:px-2">
        <div className="h-80 sm:h-[380px] overflow-hidden">
          {isLoaded ? (
            <Map directions={directions} isLoaded={isLoaded} onChange={calculatePrice} />
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              Loading Google Maps...
            </div>
          )}
        </div>

        <div >
          {!showPriceDetails ? (
            <button
              type="button"
              className="w-full py-3 h-fit bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
              disabled={loading}
              onClick={calculatePrice}
            >
              {loading ? t("Calculando...", "Calculating...") : t("Calcular Preço", "Calculate Price")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              {t(`Solicitar por ${preco} €`, "Book Now")}
            </button>
          )}
        </div>

        <div className="bg-white w-full flex items-center py-2">
  <ServiceIcon
    icon={<FaLifeRing size={22} />}
    label="Assistência"
    isSelected={selectedService === 'Assistência'}
    onClick={() => dispatch(setUser({ field: "transport.selectedService", value: "Assistência" }))}
  />
  <ServiceIcon
    icon={<FaTruckPickup size={22} />}
    label="Transporte"
    isSelected={selectedService === 'Transporte'}
    onClick={() => dispatch(setUser({ field: "transport.selectedService", value: "Transporte" }))}
  />
  <ServiceIcon
    icon={<FaTools size={22} />}
    label="Mecânica Simples"
    isSelected={selectedService === 'Mecânica Simples'}
    onClick={() => dispatch(setUser({ field: "transport.selectedService", value: "Mecânica Simples" }))}
  />
  <ServiceIcon
    icon={<MdLocalCarWash size={22} />}
    label="Limpeza e Manutenção"
    isSelected={selectedService === 'Limpeza e Manutenção'}
    onClick={() => dispatch(setUser({ field: "transport.selectedService", value: "Limpeza e Manutenção" }))}
  />
</div>


    </div>
  );
};

export default Location
const ServiceIcon = ({ icon, label, isSelected, onClick }) => (
  <div
    className={`flex flex-col py-2 items-center justify-center cursor-pointer flex-1 min-w-[60px] transition-all duration-200 ${
      isSelected ? ' shadow-inner rounded-xl scale-105' : ''
    }`}
    onClick={onClick}
  >
    <div
      className={`p-2 rounded-full mb-1 transition ${
        isSelected ? 'bg-blue-200 text-blue-800' : 'bg-gray-100'
      }`}
    >
      {icon}
    </div>
    <span
      className={`text-xs text-center leading-tight ${
        isSelected ? 'text-blue-800 font-semibold' : ''
      }`}
    >
      {label}
    </span>
  </div>
);
