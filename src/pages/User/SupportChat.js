import React from 'react';
import { useSelector } from 'react-redux';
import '@fortawesome/fontawesome-free/css/all.min.css';

const SupportChat = () => {
    const language = useSelector((state) => state.language);

    const handleChatClick = () => {

    const phoneNumber = '926589300'; // Replace with the actual WhatsApp phone number
    const message = 'Hello, need Help!'; // Customize the default message
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
  };

  return (
    <div
      onClick={handleChatClick}
      className="fixed bottom-25 right-5 bg-green-500 text-white p-4 rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:bg-green-600"
    >
      <i className="fab fa-whatsapp text-3xl"></i>
    </div>
  );
};

export default SupportChat;
