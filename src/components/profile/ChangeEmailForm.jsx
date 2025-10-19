import { useState, useContext } from "react";
import { updateEmail } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import { Mail, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function ChangeEmailForm({ onSuccess, onCancel }) {
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const { user, updateUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (newEmail === user?.email) {
      setStatus("error");
      setMessage("New email must be different from current email.");
      return;
    }

    setLoading(true);
    setStatus(null);
    setMessage("");

    try {
      await updateEmail(newEmail);
      setStatus("success");
      setMessage("Email updated successfully!");

      // Update user data
      if (updateUser) {
        updateUser({ ...user, email: newEmail });
      }

      // Close form after 2 seconds
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error("Error updating email:", error);
      setStatus("error");

      // Error handling
      if (error.response?.status === 400) {
        setMessage(
          error.response?.data?.message || "Email already in use or invalid."
        );
      } else if (error.response?.status === 401) {
        setMessage("Unauthorized access. Please login again.");
      } else {
        setMessage(
          error.response?.data?.message ||
            "Failed to update email. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Change Email Address
          </h3>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
          <div className="flex gap-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Your email will be updated immediately. Make sure you have access
              to the new email address.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* New Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Email
            </label>
            <input
              type="email"
              placeholder="Enter your new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              disabled={loading || status === "success"}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Success Message */}
          {status === "success" && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Success!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Your email has been updated to <strong>{newEmail}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === "error" && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Error
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || status === "success" || !newEmail}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading
                ? "Updating..."
                : status === "success"
                ? "Updated!"
                : "Update Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
