import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { LogOut, User, Mail, Shield, Edit2 } from "lucide-react";
import SubscriptionPlan from "@/components/subscription/SubscriptionPlan";
import ChangeEmailForm from "./ChangeEmailForm";

export default function UserProfileCard() {
  const { user, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  const getInitials = () => {
    const name = user.username || user.email;
    return name.substring(0, 2).toUpperCase();
  };

  const handleEmailChangeSuccess = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>

        {/* Profile Section */}
        <div className="px-6 pb-6">
          <div className="flex flex-col items-center -mt-16">
            {/* Avatar */}
            <div className="bg-white dark:bg-gray-700 rounded-full p-1 shadow-lg mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full w-24 h-24 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {getInitials()}
                </span>
              </div>
            </div>

            {/* User Info */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {user.username || "User"}
            </h2>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{user.email}</span>
            </div>

            {/* Stats/Info Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Subscription Card */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Subscription
                  </h3>
                </div>
                <SubscriptionPlan plan={user.subscriptionPlan} />
              </div>

              {/* Account Status Card */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Account Status
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 mb-6"></div>

            {/* Edit Profile Section */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-xl transition-all duration-200 font-medium border border-blue-200 dark:border-blue-800 mb-6"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="w-full mb-6">
                <ChangeEmailForm
                  onSuccess={handleEmailChangeSuccess}
                  onCancel={() => setIsEditing(false)}
                />
              </div>
            )}

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 mb-6"></div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 px-6 py-3 rounded-xl transition-all duration-200 font-medium border border-red-200 dark:border-red-800"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
