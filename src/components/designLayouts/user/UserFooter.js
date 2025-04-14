import React from 'react';
import { useSelector } from 'react-redux';

const UserFooter = () => {
  const language = useSelector((state) => state.language);
  return (
    <footer className="bg-gray-900 text-white py-3 fixed bottom-0 left-0 w-full shadow-xl z-50">
      <div className="flex justify-between items-center text-center">
        {/* Serviços */}
        <div className="w-1/4">
          <a
            href="/user/services"
            className="block text-sm sm:text-base font-medium hover:text-green-400 transition-all"
          >
            {language === 'pt' ? 'Serviços' : 'Services'}
          </a>
        </div>

        {/* Painel */}
        <div className="w-1/4">
          <a
            href="/user"
            className="block text-sm sm:text-base font-medium hover:text-green-400 transition-all"
          >
            {language === 'pt' ? 'Painel' : 'Dashboard'}
          </a>
        </div>

        {/* Definições */}
        <div className="w-1/4">
          <a
            href="/user/settings"
            className="block text-sm sm:text-base font-medium hover:text-green-400 transition-all"
          >
            {language === 'pt' ? 'Definições' : 'Settings'}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
