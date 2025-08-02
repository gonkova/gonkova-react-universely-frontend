import { useBillingPortalRedirect } from "@/hooks/useBillingPortalRedirect";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SubscriptionPlan({ plan }) {
  const { accessToken } = useContext(AuthContext);
  const redirectToBilling = useBillingPortalRedirect(accessToken);
  const navigate = useNavigate();

  let planLabel;

  switch (plan) {
    case 0:
      planLabel = "Basic";
      break;
    case 1:
      planLabel = "Premium";
      break;
    case null:
    case undefined:
      return (
        <div className="text-center mt-4">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            You currently have no active subscription plan.
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
          >
            View Plans
          </button>
        </div>
      );
    default:
      planLabel = "Unknown";
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
