import React from 'react';
import { customFetch } from '../../utils/customFetch';
import { setAvailable, setUnAvailable } from '../../redux/driver';
import { useDispatch, useSelector } from 'react-redux';

const Switch = () => {
  const dispatch = useDispatch();
  const driver = useSelector((state) => state.driver);
  const language = useSelector((state) => state.loja.language);

  const toggleAvailability = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const result = await customFetch(
          'GET',
          token,
          null,
          'driver/toogle-availability'
        );
        if (result.available !== undefined) {
          if (result.available) {
            dispatch(setAvailable());
          } else {
            dispatch(setUnAvailable());
          }
        }
      } catch (error) {
        console.error('Error toggling availability:', error);
      }
    }
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-full shadow-lg">
      {/* Circle Indicator */}
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
        onClick={toggleAvailability}
        style={{
          backgroundColor: driver.available ? 'green' : 'red',
        }}
      >

      </div>

      {/* Availability Text */}
      <span className="text-white font-semibold">
        {driver.available
          ? language === 'pt'
            ? 'Disponível'
            : 'Available'
          : language === 'pt'
          ? 'Indisponível'
          : 'Unavailable'}
      </span>
    </div>
  );
};

export default Switch;

