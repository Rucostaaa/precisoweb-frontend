import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setOrderStatus, setDriverLocation } from "../../redux/user";
import { MultiStepOrder } from "../Reboque/Reboque";
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL, { transports: ['websocket'] });

const UserDashboard = () => {
  const user = useSelector((state) => state.user);
  const onGoingOrders = user?.onGoingOrders;
  const dispatch = useDispatch();
  const [showOrderFlow, setShowOrderFlow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (onGoingOrders && onGoingOrders.length > 0) {
      onGoingOrders.forEach((order) => {
        const payload = { orderId: order._id, user };
        socket.emit("joinOrder", payload);
      });

      socket.on("driverLocationUpdated", (payload) => {
        const { orderId, coords } = payload;
        dispatch(setDriverLocation({ orderId, coords }));
        dispatch(setUser({
          field: "onGoingOrders",
          value: onGoingOrders.map(order =>
            order._id === orderId ? { ...order, driverLocation: coords } : order
          )
        }));
      });

      socket.on("orderUpdated", (payload) => {
        const { taskId, state } = payload;
        dispatch(setUser({ field: "currentOrder.state", value: state }));
        dispatch(setOrderStatus({ _id: taskId, newState: state }));
        dispatch(setUser({
          field: "onGoingOrders",
          value: user?.onGoingOrders.map(order =>
            order._id === taskId ? { ...order, state: state } : order
          )
        }));
      });

      return () => {
        socket.off("driverLocationUpdated");
        socket.off("orderUpdated");
      };
    }
  }, [dispatch, onGoingOrders, user]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">
      {onGoingOrders?.length > 0 ? (
        <>
        {!showOrderFlow &&<button
            onClick={() => setShowOrderFlow(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Order Another Tranport          
            </button>}

          {showOrderFlow &&<MultiStepOrder step={step} handleNext={handleNext} handlePrev={handlePrev} />}

        <OnGoingOrders /> 
        </>
      ) : (
        <>
          {<MultiStepOrder step={step} handleNext={handleNext} handlePrev={handlePrev} />}
        </>
      )}
    </div>
  );
};

export default UserDashboard;

// Individual Order Card
export const Order = ({ order }) => {
  if (!order) return (
    <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
      No order available
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 flex flex-col gap-3 border border-gray-100">
      <h3 className="text-xl font-semibold text-indigo-600">{order.issue || "Sem descrição do problema"}</h3>
      <div className="text-gray-700 space-y-1 text-sm">
        <p><strong>Veículo:</strong> {order.vehicle?.brand || "Desconhecido"} {order.vehicle?.model || ""}</p>
        <p><strong>Recolha:</strong> {order.pickup?.address || "Endereço não disponível"}</p>
        <p><strong>Estado:</strong> <span className="capitalize">{order.state || "Desconhecido"}</span></p>
        <p><strong>Preço:</strong> €{order.price ? order.price.toFixed(2) : "N/A"}</p>
      </div>
      <SelectCurrent order={order} />
    </div>
  );
};

// Detalhes button
export const SelectCurrent = ({ order }) => {
  const dispatch = useDispatch();

  return (
    <button
      className="mt-3 self-start px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      onClick={() => dispatch(setUser({ field: "currentOrder", value: order }))}
    >
      Ver Detalhes
    </button>
  );
};

// Completed Orders Section
export const Orders = () => {
  const user = useSelector((state) => state.user);
  const pastOrders = (user.orders || []).filter((order) => order.state === "finalized");

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Pedidos Finalizados</h2>
      {pastOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastOrders.map((order) => (
            <Order key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Ainda não há pedidos finalizados.</p>
      )}
    </div>
  );
};

// Ongoing Orders Section
export const OnGoingOrders = () => {
  const user = useSelector((state) => state.user);
  const onGoingOrders = user.onGoingOrders || [];

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Pedidos em Andamento</h2>

      {onGoingOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {onGoingOrders.map((order) => (
            <Order key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">Sem pedidos em andamento no momento.</p>
      )}
    </div>
  );
};
