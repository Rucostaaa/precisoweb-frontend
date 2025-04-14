import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentOrder } from '../../redux/user';
import GoogleMapComponent from '../../pages/User/GoogleMapComponent';
import { FaStar } from "react-icons/fa";
import { customFetch } from '../../utils/customFetch';

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  pickUp: "bg-indigo-100 text-indigo-700",
  dropOff: "bg-purple-100 text-purple-700",
  finalized: "bg-green-100 text-green-700",
};

const CurrentOrder = () => {
  const user = useSelector((state) => state.user);
  const order = user?.currentOrder;
  const driver = user?.currentOrder?.driver;

  const state = order?.state;
  const dispatch = useDispatch();
  console.log("state",state);

  const [msg, setMsg] = useState("");
  
  useEffect(() => {
    if (state === "pending") setMsg("À espera que o motorista aceite o serviço");
    else if (state === "accepted") setMsg(`O ${driver?.name || ""} está a ir ao seu encontro`);
    else if (state === "pickup") setMsg(`O ${driver?.name || ""} chegou`);
    else if (state === "dropoff") setMsg(`O ${driver?.name || ""} está quase a terminar o serviço`);
    else if (state === "finalized") setMsg("Serviço Concluído");
    else setMsg("");
  }, [state, driver]);

  if (!order || Object.keys(order).length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Gradient top bar */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl z-10"
          onClick={() => dispatch(clearCurrentOrder())}
        >
          <FaTimes />
        </button>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Detalhes do Pedido</h2>

          {/* Status Badge */}
          <div className='flex justify-between'>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusStyles[state] || 'bg-gray-100 text-gray-600'}`}>
                {msg}
              </div>
              {order.state==="finalized"&&   <p
                onClick={() => alert('Solicitar Fatura clicked!')}
                className="py-2 px-4 underline rounded-lg h-fit pointer font-medium transition-all"
              >
                Receber fatura via e-mail
              </p>}
           
          </div>

          {/* Vehicle & Info */}
          <div className="space-y-2 text-gray-700">
            <span className='flex w-[100%] justify-between'>
                <p><strong>Veículo:</strong> {order.vehicle?.brand || "Desconhecido"} {order.vehicle?.model || ""}</p>
            <p><strong>Problema:</strong> {order.issue || "Não especificado"}</p>
            </span>
            <p><strong>Local de Carga:</strong> {order.pickup?.address || "Não disponível"}</p>
            <p><strong>Local de Descarga:</strong> {order.destination?.address || "Não disponível"}</p>
          </div>
            {order?.state === "finalized" &&
              <RatingSubmit />
              
          
            }
  
          {order?.state !== "finalized" &&
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-inner h-64">
              <GoogleMapComponent />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default CurrentOrder;

const RatingSubmit = () => {
  const [ratingDriver, setRatingDriver] = useState(0); // Driver rating
  const [ratingOrder, setRatingOrder] = useState(0); // Order rating
  const [hover, setHover] = useState(null);
  const [feedbackDriver, setFeedbackDriver] = useState("");
  const [feedbackOrder, setFeedbackOrder] = useState("");
  const [submittedDriver, setSubmittedDriver] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const user = useSelector((state) => state.user); // Access the user info (make sure it's set in Redux)
  const order = user?.currentOrder; // Get the current order from Redux

  const handleDriverSubmit = async () => {
    if (!ratingDriver) return alert("Por favor, selecione uma avaliação para o motorista.");

    try {
      const token =localStorage.getItem("token") // Ensure user has a token stored in Redux or localStorage
      console.log(token);
      
      const body = {
        rating: ratingDriver,
        comment: feedbackDriver,
        target: "motorista", // 'motorista' is the target for driver review
      };

      await customFetch("POST", token, body, `user/order/${order._id}/reviews`);

      setSubmittedDriver(true);
    } catch (error) {
      console.error("Erro ao enviar avaliação do motorista:", error);
      alert("Houve um erro ao enviar sua avaliação.");
    }
  };

  const handleOrderSubmit = async () => {
    if (!ratingOrder) return alert("Por favor, selecione uma avaliação para o pedido.");

    try {
      const token = localStorage.getItem("token"); // Ensure user has a token stored in Redux or localStorage
      const body = {
        rating: ratingOrder,
        comment: feedbackOrder,
        target: "servico", // 'servico' is the target for order review
      };

      await customFetch("POST", token, body, `user/order/${order._id}/reviews`);

      setSubmittedOrder(true);
      setSuccessMsg(true);

      // Hide success message after 2 seconds
      setTimeout(() => {
        setSuccessMsg(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao enviar avaliação do pedido:", error);
      alert("Houve um erro ao enviar sua avaliação.");
    }
  };

  if (successMsg) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center">
          <h3 className="text-xl font-semibold text-green-600">Obrigado pela sua avaliação!</h3>
          <p>A sua opinião ajuda-nos a melhorar o serviço.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      {!submittedDriver && !submittedOrder && (
        <>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Avalie o motorista</h3>
          {/* Driver Rating */}
          <div className="flex justify-center items-center gap-1 mb-4">
            {[...Array(5)].map((_, index) => {
              const value = index + 1;
              return (
                <button
                  key={value}
                  onClick={() => setRatingDriver(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(null)}
                  className="focus:outline-none"
                >
                  <FaStar
                    size={30}
                    className={`transition-colors duration-200 ${value <= (hover || ratingDriver) ? "text-yellow-400" : "text-gray-300"}`}
                  />
                </button>
              );
            })}
          </div>
          {/* Driver Feedback */}
          <textarea
            value={feedbackDriver}
            onChange={(e) => setFeedbackDriver(e.target.value)}
            placeholder="Comentário sobre o motorista (opcional)"
            className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none focus:ring-2 focus:ring-indigo-300 focus:outline-none mb-4 h-24"
          />
          {/* Driver Submit Button */}
          <button
            onClick={handleDriverSubmit}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-all self-end"
          >
            Submeter Avaliação do Motorista
          </button>
        </>
      )}

      {submittedDriver && !submittedOrder && (
        <>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Avalie o Pedido</h3>
          {/* Order Rating */}
          <div className="flex justify-center items-center gap-1 mb-4">
            {[...Array(5)].map((_, index) => {
              const value = index + 1;
              return (
                <button
                  key={value}
                  onClick={() => setRatingOrder(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(null)}
                  className="focus:outline-none"
                >
                  <FaStar
                    size={30}
                    className={`transition-colors duration-200 ${value <= (hover || ratingOrder) ? "text-yellow-400" : "text-gray-300"}`}
                  />
                </button>
              );
            })}
          </div>
          {/* Order Feedback */}
          <textarea
            value={feedbackOrder}
            onChange={(e) => setFeedbackOrder(e.target.value)}
            placeholder="Comentário sobre o pedido (opcional)"
            className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none focus:ring-2 focus:ring-indigo-300 focus:outline-none mb-4 h-24"
          />
          {/* Order Submit Button */}
          <button
            onClick={handleOrderSubmit}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-all self-end"
          >
            Submeter Avaliação do Pedido
          </button>
        </>
      )}
    </div>
  );
};