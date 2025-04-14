import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentOrder } from '../../redux/driver';

const DriverHistory = () => {
  const driver = useSelector((state) => state.driver);
  const language = useSelector((state) => state.loja.language);
  const dispatch = useDispatch();
  const orders = driver?.orders || [];
  const finalizedTasks = orders.filter((task) => task.state === 'finalized');

  const cardOrders = finalizedTasks
    .filter((order) => order.payment_method === "card")
    .reduce((sum, order) => sum + order.price, 0);

  const cashOrders = finalizedTasks
    .filter((order) => order.payment_method === "cash")
    .reduce((sum, order) => sum + order.price, 0);

  const toBeReceived = (cardOrders * 0.80 - cashOrders * 0.2);

  const handleRowClick = (task) => {
    dispatch(setCurrentOrder(task));
  };

  return (
    <div className="min-h mt-10 -screen w-full mx-auto px-4 flex items-center justify-center">
      <div className="max-w-5xl mx-auto bg-white shadow-xl p-4 space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {language === 'pt' ? 'Histórico de Serviços' : 'Driver History'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {language === 'pt' ? 'Todos os serviços finalizados' : 'All completed services'}
            </p>
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl text-base font-semibold shadow-sm">
            {language === 'pt' ? 'A Receber: ' : 'To Receive: '}
            <span className="text-green-700 font-bold">{toBeReceived.toFixed(2)}€</span>
          </div>
        </div>

        {/* Finalized Orders Table */}
        {finalizedTasks.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {language === 'pt' ? 'Serviços Finalizados' : 'Completed Services'}
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-xs border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="px-2 py-1 font-semibold text-gray-700 whitespace-nowrap">{language === 'pt' ? 'Data' : 'Date'}</th>
                    <th className="px-2 py-1 font-semibold text-gray-700 whitespace-nowrap">{language === 'pt' ? 'ID' : 'ID'}</th>
                    <th className="px-2 py-1 font-semibold text-gray-700 whitespace-nowrap">{language === 'pt' ? 'Veículo' : 'Vehicle'}</th>
                    <th className="px-2 py-1 font-semibold text-gray-700 whitespace-nowrap">{language === 'pt' ? 'Pagamento' : 'Payment'}</th>
                    <th className="px-2 py-1 font-semibold text-gray-700 whitespace-nowrap">{language === 'pt' ? 'Preço' : 'Price'}</th>
                    <th className="px-2 py-1 font-semibold text-gray-700 whitespace-nowrap">{language === 'pt' ? 'Receber' : 'To Receive'}</th>
                    <th className="px-2 py-1 font-semibold text-gray-700 whitespace-nowrap">{language === 'pt' ? 'Estado' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {finalizedTasks.map((task) => (
                    <tr
                      key={task._id}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(task)}
                    >
                      <td className="px-2 py-1 text-gray-800">{new Date(task.createdAt).toLocaleDateString()}</td>
                      <td className="px-2 py-1 text-gray-800 truncate max-w-[120px]" title={task._id}>
                        {task._id}
                      </td>
                      <td className="px-2 py-1 text-gray-800 truncate max-w-[120px]" title={`${task.vehicle.brand} ${task.vehicle.model}`}>
                        {task.vehicle.brand} {task.vehicle.model}
                      </td>
                      <td className="px-2 py-1 text-gray-800 whitespace-nowrap">
                        {task.payment_method === 'card' ? (language === 'pt' ? 'Cartão' : 'Card') : (language === 'pt' ? 'Dinheiro' : 'Cash')}
                      </td>
                      <td className="px-2 py-1 text-gray-800 whitespace-nowrap">{task.price.toFixed(2)}€</td>
                      <td className="px-2 py-1 text-gray-800 whitespace-nowrap">
                        {task.payment_method === "cash"
                          ? `-${(task.price * 0.2).toFixed(2)}€`
                          : `${(task.price * 0.8).toFixed(2)}€`}
                      </td>
                      <td className="px-2 py-1 text-gray-800 whitespace-nowrap">
                        {language === 'pt' ? 'Por Liquidar' : 'Unpaid'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm py-10">
            {language === 'pt' ? 'Sem histórico disponível no momento.' : 'No history available yet.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverHistory;
