import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut, User } from "lucide-react";
import SubscribeButton from "../components/SubscribeButton";
import { openBillingPortal } from "../services/payments";

export default function UserProfileCard() {
  const { user, accessToken, logout } = useContext(AuthContext);

  if (!user) return <p className="text-center mt-4">Loading...</p>;
  const handleBillingClick = async () => {
    try {
      const { billingPortalSessionUrl } = await openBillingPortal(accessToken);
      if (billingPortalSessionUrl)
        window.location.href = billingPortalSessionUrl;
    } catch (err) {
      console.error("❌ Грешка при заявка към billing-portal:", err);
      console.log("accessToken:", accessToken);

      alert("Неуспешно зареждане на Stripe портала.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <div className="flex flex-col items-center">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-3 mb-4">
          <User className="w-8 h-8 text-gray-700 dark:text-gray-300" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          Hello, {user.email}!
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Welcome to your profile.
        </p>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>

        <div className="mt-5">
          <SubscribeButton />
        </div>

        <button
          onClick={handleBillingClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition mt-5"
        >
          Manage Subscription
        </button>
      </div>
    </div>
  );
}
