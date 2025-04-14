import React, { useEffect, useState } from 'react';
import { FaTasks } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { pushToRoute, setLocation } from '../../redux/driver';
import Order from '../driver/Order';

const socket = io(process.env.REACT_APP_SOCKET_URL, { transports: ['websocket'] });

const Tasks = () => {
  const dispatch = useDispatch();
  const driver = useSelector((state) => state.driver);
  const language = useSelector((state) => state.loja.language);
  const [locationPermission, setLocationPermission] = useState(null);

  const currentTasks = driver.orders.filter((task) => task.state !== 'finalized');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    currentTasks.forEach((task) => {
      socket.emit('joinOrder', { orderId: task._id, user: driver });
    });

    return () => {
      socket.off('connect');
    };
  }, [currentTasks]);

  useEffect(() => {
    let watchId = null;

    const updateLocation = (position) => {
      const { latitude, longitude } = position.coords;
      console.log('Location updated', position.coords);
      
      dispatch(pushToRoute({ lat: latitude, lng: longitude }));
      dispatch(setLocation({ lat: latitude, lng: longitude }));

      driver.orders
        .filter((task) => task.state !== 'finalized' && task.state !== 'pending')
        .forEach((task) => {
          socket.emit('updateLocation', {
            orderId: task._id,
            coords: [longitude, latitude],
            user: driver,
          });
        });
    };

    const handleError = (error) => {
      console.error('Error watching location:', error.message);
      setLocationPermission(false); // Update state to reflect permission status
    };

    if (navigator.geolocation) {
      // Request permission if not already granted
      if (locationPermission === null) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationPermission(true); // Permission granted
          },
          (error) => {
            alert(error.message);

            setLocationPermission(false); // Permission denied or error
            handleError(error);
          }
        );
      }

      // If permission granted, start watching the location
      if (locationPermission === true) {
        watchId = navigator.geolocation.watchPosition(updateLocation, handleError, {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        });
      } else if (locationPermission === false) {
      }
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [dispatch, driver, locationPermission]);

  // Listen to incoming driverLocation updates (e.g., from server broadcast)
  useEffect(() => {
    socket.on('driverLocation', ({ coords, orderId }) => {
      dispatch(setLocation({ lat: coords[1], lng: coords[0] }));
    });

    return () => {
      socket.off('driverLocation');
    };
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaTasks className="text-blue-500" />
            {driver.orders.some((task) => task.state !== 'finalized')
              ? language === 'pt'
                ? 'Serviços em curso'
                : 'Current Orders'
              : language === 'pt'
              ? 'Sem serviços em curso'
              : 'No Orders'}
          </h2>
        </div>

        <ul className="space-y-4">
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => (
              <Order key={task._id} task={task} id={task._id} />
            ))
          ) : (
            <p className="text-center text-gray-500">
              {language === 'pt' ? 'Nenhuma nova tarefa' : 'No new tasks'}
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Tasks;
