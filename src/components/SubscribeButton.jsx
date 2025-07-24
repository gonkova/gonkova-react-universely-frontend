import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createCheckoutSession } from "../services/payments";

export default function SubscribeButton() {
  const { accessToken } = useContext(AuthContext);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    try {
      await createCheckoutSession(1, accessToken); // plan = 1
      setIsSubscribed(true);
      // След успешно създаване на сесия, пренасочваме
      navigate("/success"); // тук сложи пътя към страницата Success
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error creating payment.");
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      className={`px-4 py-2 rounded ${
        isSubscribed
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-purple-600 hover:bg-purple-700"
      } text-white`}
      disabled={isSubscribed}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
