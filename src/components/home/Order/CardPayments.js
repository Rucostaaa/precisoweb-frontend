import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPayment } from "../../../redux/user";
import { setLoading } from "../../../redux/application";
import { useNavigate } from "react-router-dom";
import { customFetch } from "../../../utils/customFetch";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const CardPayments = ({ handlePrev }) => {
  const user = useSelector((state) => state.user);
  const language = useSelector((state) => state.loja.language);
  const payment = useSelector((state) => state.user.payment);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
console.log(user.transport.preco);

  const handlePaymentChange = (e) => {
    const { id, value } = e.target;
    dispatch(setPayment({ ...payment, [id]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    if (payment.paymentMethod === "cash") {
      try {
        dispatch(setLoading(true));
        const result = await customFetch("POST", token, { user }, "user/create-order");
        
        if (result.order) {
          alert(language === "pt" ? "Pedido enviado com sucesso!" : "Order submitted successfully!");
          navigate("/user");
        } else {
          alert(language === "pt" ? "Erro ao enviar o pedido" : "Error submitting order");
        }
      } catch (err) {
        console.error("Error during cash order submission:", err);
        alert(language === "pt" ? "Erro ao criar o pedido" : "Failed to create order");
      } finally {
        dispatch(setLoading(false));
      }
      return;
    }
  
    // Proceed with card payment flow if paymentMethod is 'credit_card'
    if (!stripe || !elements) return;
  
    dispatch(setLoading(true));
    const cardElement = elements.getElement(CardElement);
  
    try {
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
  
      if (pmError) {
        console.error("Payment Method Error:", pmError);
        alert("Payment method creation failed!");
        return;
      }
  
      const paymentIntentRes = await customFetch(
        "POST", token,
        { amount: user.transport?.preco || 10.00, user },
        "user/create-payment-intent"
      );
  
      const clientSecret = paymentIntentRes?.clientSecret;
      if (!clientSecret) {
        throw new Error("No client secret returned");
      }
  
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });
  
      if (confirmError) {
        console.error("Payment confirmation error:", confirmError);
        alert("Payment failed!");
      } else if (paymentIntent.status === "succeeded") {
        alert(language === "pt" ? "Pagamento bem-sucedido!" : "Payment successful!");
  
        const result = await customFetch("POST", token, { user }, "user/create-order");
  
        if (result.order) {
          alert(language === "pt" ? "Pedido enviado com sucesso!" : "Order submitted successfully!");
          navigate("/user");
        } else {
          alert("Erro ao enviar o pedido");
        }
      }
    } catch (err) {
      console.error("Error during payment:", err);
      alert(language === "pt" ? "Erro no pagamento" : "Payment error");
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        {language === "pt" ? "Informações de Pagamento" : "Payment Information"}
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit} >
        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-600">
            {language === "pt" ? "Método de Pagamento" : "Payment Method"}
          </label>
          <select
            id="paymentMethod"
            value={payment.paymentMethod}
            onChange={handlePaymentChange}
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >            
            <option value="cash">
              {language === "pt" ? "Em dinheiro no local" : "Cash on Spot"}
            </option>
            <option value="credit_card">
              {language === "pt" ? "Cartão de Crédito/Visa" : "Credit Card/Visa"}
            </option>

          </select>
        </div>

        {payment.paymentMethod === "credit_card" && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {language === "pt" ? "Detalhes do Cartão" : "Card Details"}
            </label>
            <div className="border p-3 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handlePrev}
            className="w-full py-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
          >
            {language === "pt" ? "Voltar" : "Back"}
          </button>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            {language === "pt" ? "Enviar" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardPayments;
