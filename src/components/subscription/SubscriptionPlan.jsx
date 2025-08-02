import { useBillingPortalRedirect } from "@/hooks/useBillingPortalRedirect";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function SubscriptionPlan({ plan }) {
  const { accessToken } = useContext(AuthContext);
  const redirectToBilling = useBillingPortalRedirect(accessToken);

  let planLabel;
  let hasPlan = true;

  switch (plan) {
    case 0:
      planLabel = "Basic";
      break;
    case 1:
      planLabel = "Premium";
      break;
    case null:
    case undefined:
      hasPlan = false;
      break;
    default:
      planLabel = "Unknown";
  }

  if (!hasPlan) {
    return (
      <div className="text-center mt-4">
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          You currently have no active subscription plan.
        </p>
        <button
          onClick={redirectToBilling}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
        >
          Subscribe
        </button>
      </div>
    );
  }

  return (
    <div className="text-center mt-4">
      <p className="text-gray-700 dark:text-gray-300 mb-2">
        Your plan: <strong>{planLabel}</strong>
      </p>
      <button
        onClick={redirectToBilling}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
      >
        Manage Subscription
      </button>
    </div>
  );
}
