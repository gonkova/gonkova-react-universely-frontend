import api from "./api";
import { stripePromise } from "../lib/stripe";

export async function createCheckoutSession(subscriptionPlan, accessToken) {
  const response = await api.post(
    "/payments/checkout-session",
    { subscriptionPlan },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = response.data;

  if (data.sessionUrl) {
    window.location.href = data.sessionUrl;
  } else if (data.sessionId) {
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId: data.sessionId });
  } else {
    throw new Error("Session ID or URL missing.");
  }
}

export async function openBillingPortal(accessToken) {
  try {
    const response = await api.post(
      "/payments/billing-portal",
      {},

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("✅ Успешен отговор от billing portal:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Грешка при заявка към billing-portal:", error);
    console.log("➡️ Axios config:", error.config);
    console.log("📡 Axios request headers:", error.config?.headers);
    console.log("📭 Axios response data:", error.response?.data);
    console.log("📋 Axios response status:", error.response?.status);
    throw error;
  }
}
