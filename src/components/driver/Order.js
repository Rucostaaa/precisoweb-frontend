import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {  setCurrentOrder } from '../../redux/driver';

const Order = ({task}) => {    
    const language=useSelector((state)=>state.loja.language)
    const dispatch=useDispatch()
     const handleDetailsClick = (task) => {
        dispatch(setCurrentOrder(task));
      };
  return (
    <div>            <li
    key={task._id}
    className="bg-gray-50 p-5 rounded-xl shadow-sm border hover:shadow-lg transition"
  >
    <div className="flex justify-between items-center mb-2">
      <div>
        <div className="font-semibold text-lg text-gray-800">
          {task.vehicle.brand} / {task.vehicle.model}{' '}
          <span className="text-sm text-gray-500">({task.vehicle.plate})</span>
        </div>
      </div>
      <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
        {task.state}
      </span>
    </div>

    <div className="flex justify-between text-sm text-gray-600 mb-3">
      <span>
        <strong>{language === 'pt' ? 'Carga:' : 'Pickup:'}</strong>{' '}
        {task?.pickup?.address}
      </span><span>
      <strong>{language === 'pt' ? 'Avaria:' : 'Issue:'}</strong>{' '}
      {task?.issue}

      </span>
      
    </div>

    <div className="flex justify-between text-sm text-gray-600 mb-3">
      <span>
        <strong>{language === 'pt' ? 'Destino:' : 'Destination:'}</strong>{' '}
        {task?.destination?.address}
      </span>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm rounded-lg shadow-md transition"
        onClick={() => handleDetailsClick(task)}
      >
        {language === 'pt' ? 'Detalhes' : 'Details'}
      </button>
    </div>
  </li></div>
  )
}

export default Order