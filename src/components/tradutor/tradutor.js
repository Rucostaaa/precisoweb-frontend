import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chooseLanguage } from "../../redux/loja";

const Tradutor = () => {
  const dispatch = useDispatch();
  const [clicked, setClicked] = useState(false);  // Track if the button is clicked
  const language = useSelector((state) => state.loja.language); // Get the current language from the Redux store
  useEffect(()=>{  console.log(language);
},[language])
  
  const handleClick = () => {
    const newLanguage = language === "pt" ? "en" : "pt";  // Toggle language between 'pt' and 'en'
    dispatch(chooseLanguage(newLanguage));  // Dispatch the action to update language state
    setClicked(!clicked);  // Toggle the clicked state to underline the text
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`text-lg ${clicked ? 'underline' : ''} hover:text-blue-500 transition-all`}
      >
        {language === "pt" ? "En" : "Pt"}  {/* Toggle button text */}
      </button>
    </div>
  );
};

export default Tradutor;

