import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/user";


const Services = () => {
  return (
    <div className="w-full">
      <Orders />
    </div>
  );
};

export default Services;

// Individual Order Card
export const Order = ({ order }) => {
  if (!order) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
        No order available
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 flex flex-col gap-4 border border-gray-100 h-full">
      <div className="flex flex-row justify-between items-start gap-6">
        {/* Order Info - 65% width */}
        <div className="w-[65%] text-gray-700 space-y-2 text-sm">
          <p>
            <strong>Veículo:</strong>{" "}
            {order.vehicle?.brand || "Desconhecido"} {order.vehicle?.model || ""}
          </p>
          <p>
            <strong>Recolha:</strong>{" "}
            {order.pickup?.address || "Endereço não disponível"}
          </p>
          <p>
            <strong>Avaria:</strong> {order.issue || "Sem descrição do problema"}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className="capitalize">{order.state || "Desconhecido"}</span>
          </p>
          <p>
            <strong>Preço:</strong> €
            {order.price ? order.price.toFixed(2) : "N/A"}
          </p>
        </div>

        {/* Driver Info */}
        <div className="w-[35%] my-auto flex flex-col items-center justify-start gap-2">
          {order?.driver?.image ? (
            <img
              src={order.driver.image}
              alt={`Foto de ${order.driver.name}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white text-lg font-bold">
              {order?.driver?.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <p className="text-sm text-gray-700 font-medium text-center">
            Motorista: {order?.driver?.name || "Desconhecido"}
          </p>
        </div>
      </div>

      <SelectCurrent order={order} />
    </div>
  );
};

// Button to select current order
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

// Orders list
export const Orders = () => {
  const user = useSelector((state) => state.user);
  const pastOrders = (user.orders || []).filter(
    (order) => order.state === "finalized"
  );

  return (
    <div className="mt-10 w-full px-4">
      <h2 className="text-2xl font-bold w-fit mx-auto mb-4 text-gray-800">Histórico</h2>
      {pastOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 w-full max-w-[900px] mx-auto">
          {pastOrders.map((order) => (
            <Order key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 ml-4">Ainda não há pedidos finalizados.</p>
      )}
    </div>
  );
};
