import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from "../../../redux/user"; 

const PersonalInformation = ({ handlePrev, handleNext }) => {
  const language = useSelector((state) => state.loja.language);
  const { name, email, phone } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Handle form changes and update the Redux store
  const handleInputChange = (e) => {
    const { id, value } = e.target;
  
    if (id === "phone") {
      if (e.nativeEvent.inputType === "deleteContentBackward") {
        // Handle backspace by removing the last digit
        const updatedPhone = phone.slice(0, -1); // Remove the last character
        dispatch(setUser({ field: id, value: updatedPhone }));
      } else {
        // Append only the new character
        dispatch(setUser({ field: id, value }));
      }
    } else {
      // For other fields, just update as normal
      dispatch(setUser({ field: id, value }));
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        {language === 'pt' ? 'Informações Pessoais' : 'Personal Information'}
      </h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            {language === 'pt' ? 'Nome' : 'Full Name'}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleInputChange} // Update Redux store on input change
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            {language === 'pt' ? 'Email' : 'Email Address'}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleInputChange} // Update Redux store on input change
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
            {language === 'pt' ? 'Telefone' : 'Phone Number'}
          </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={handleInputChange} // Update Redux store on input change
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handlePrev}
            className="w-full py-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
          >
            {language === 'pt' ? 'Voltar' : 'Back'}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            {language === 'pt' ? 'Próximo' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
