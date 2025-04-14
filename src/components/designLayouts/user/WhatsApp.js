import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsApp = () => {
  const handleChatClick = () => {
    const phoneNumber = '926589300';
    const message = 'Olá, preciso de ajuda!';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleChatClick}
      className="fixed bottom-[65px] right-5 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg flex items-center justify-center z-50"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
    </button>
  );
};

export default WhatsApp;
