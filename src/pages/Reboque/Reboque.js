import React, { useState } from "react";
import VehicleInformation from "../../components/home/Order/VehicleInformation";
import PersonalInformation from "../../components/home/Order/PersonalInformation";
import CardPayments from "../../components/home/Order/CardPayments";

import Header from "../../components/home/Header/Header";
import Footer from "../../components/home/Footer/Footer";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Location from "../../components/home/Order/Location";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Reboque = () => {
  const [step, setStep] = useState(0); // Track the current step of the form

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <>
      <Header />
      <MultiStepOrder step={step} handleNext={handleNext} handlePrev={handlePrev}/>
      <Footer />
    </>
  );
};

export default Reboque;
export const MultiStepOrder=({step,handleNext,handlePrev})=>{

  return(
    <>
      <div className="min-h-screen py-1">
        <div className="w-[90%] max-w-3xl mx-auto p-5 bg-white shadow-lg rounded-lg">
          {step === 0 && <Location handleNext={handleNext} />}

          {step === 1 && <VehicleInformation handlePrev={handlePrev}handleNext={handleNext} />}
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
    </>
  )
}
