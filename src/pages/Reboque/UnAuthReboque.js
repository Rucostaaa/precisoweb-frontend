import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Import useDispatch
import VehicleInformation from "../../components/home/Order/VehicleInformation";
import PersonalInformation from "../../components/home/Order/PersonalInformation";
import CardPayments from "../../components/home/Order/CardPayments";

import Header from "../../components/home/Header/Header";
import Footer from "../../components/home/Footer/Footer";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "react-router-dom";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Reboque = () => {
    const { token } = useParams();
    const language = useSelector((state) => state.loja.language);
    const [step, setStep] = useState(1); // Track the current step of the form
    const handleNext = () => {
        setStep((prevStep) => prevStep + 1);
    };
    useEffect(() => {
        if (token) {
          // Store the token in localStorage when it's available
          localStorage.setItem("token", token);
        }
      }, [token]);

  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-4">
        <div className="w-full max-w-3xl mx-auto p-5 bg-white shadow-lg rounded-lg">
          {step === 1 && <VehicleInformation handleNext={handleNext} />}
          {step === 2 && (
            <PersonalInformation handleNext={handleNext} handlePrev={handlePrev} />
          )}
          {step === 3 && (
            <Elements stripe={stripePromise}>
              <CardPayments handlePrev={handlePrev} />
            </Elements>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Reboque;
