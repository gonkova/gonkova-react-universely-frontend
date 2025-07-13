import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut, User } from "lucide-react";

export default function UserProfileCard() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return <p className="text-center mt-4">Зареждане...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <div className="flex flex-col items-center">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-3 mb-4">
          <User className="w-8 h-8 text-gray-700 dark:text-gray-300" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          Здравей, {user.email || "потребителю"}!
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Добре дошъл в профила си.
        </p>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
        >
          <LogOut className="w-4 h-4" />
          Изход
        </button>
      </div>
    </div>
  );
}
