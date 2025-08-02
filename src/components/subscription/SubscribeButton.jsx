import { useSubscriptionRedirect } from "@/hooks/useSubscriptionRedirect";

export default function SubscribeButton({ plan }) {
  const { subscribe, loadingPlan } = useSubscriptionRedirect();

  if (!plan) return null;

  const isLoading = loadingPlan === plan.name;

  return (
    <button
      onClick={() => subscribe(plan)}
      disabled={isLoading}
      className={`w-full py-2 rounded text-sm font-medium transition ${
        plan.highlighted
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
      }`}
    >
      {isLoading
        ? "Processing..."
        : plan.name === "Free"
        ? "Get Started"
        : "Subscribe Now"}
    </button>
  );
}
