import { openBillingPortal } from "@/services/payments";

export function useBillingPortalRedirect(accessToken) {
  return async function redirect() {
    try {
      const { billingPortalSessionUrl } = await openBillingPortal(accessToken);

      if (billingPortalSessionUrl) {
        window.location.href = billingPortalSessionUrl;
      } else {
        throw new Error("No billingPortalSessionUrl returned");
      }
    } catch (err) {
      console.error("❌ Failed to open billing portal:", err);
      alert("Неуспешно зареждане на Stripe портала.");
    }
  };
}
