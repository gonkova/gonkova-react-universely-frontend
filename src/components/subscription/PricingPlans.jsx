import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import SubscribeButton from "@/components/subscription/SubscribeButton";

export default function PricingPlans() {
  const { user } = useContext(AuthContext);

  const plans = [
    {
      id: null,
      name: "Free",
      price: "$0",
      features: ["Access to free stories", "Track your story progress"],
      highlighted: false,
    },
    {
      id: 0,
      name: "Basic",
      price: "$4.00 / month",
      features: ["Access to 15 premium stories", "Track your story progress"],
      highlighted: false,
    },
    {
      id: 1,
      name: "Premium",
      price: "$7.00 / month",
      features: ["Unlimited stories", "Track your story progress"],
      highlighted: true,
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative border rounded-2xl p-6 shadow transition-all duration-300 ${
              plan.highlighted
                ? "bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-600"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                Most Popular
              </div>
            )}

            <div className="hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
              <h3 className="text-xl font-semibold text-center mb-2">
                {plan.name}
              </h3>
              <p className="text-lg font-bold text-center mb-4">{plan.price}</p>

              <ul className="text-sm mb-6 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <SubscribeButton plan={plan} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
