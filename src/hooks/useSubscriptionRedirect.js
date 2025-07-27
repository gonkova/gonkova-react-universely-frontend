import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { createCheckoutSession } from "@/services/payments";

export function useSubscriptionRedirect() {
  const { accessToken, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const subscribe = async (plan) => {
    if (!plan) {
      console.error("❌ Missing plan in subscribe()");
      return;
    }

    if (plan.name === "Free") {
      navigate("/stories");
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setLoadingPlan(plan.name);
      await createCheckoutSession(plan.id, accessToken);
    } catch (err) {
      console.error("❌ Checkout error:", err);
      alert("Failed to initiate checkout session.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return { subscribe, loadingPlan };
}
