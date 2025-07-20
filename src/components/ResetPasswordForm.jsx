import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { resetPassword } from "../services/api";

export default function ResetPasswordForm() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = window.location.search;
    const params = new URLSearchParams(raw);

    const rawEmail = params.get("email");
    const rawToken = raw.match(/token=([^&]*)/)?.[1];

    console.log("✅ Raw email:", rawEmail);
    console.log("✅ Raw token:", rawToken);

    setEmail(rawEmail);
    setToken(rawToken);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !token) {
      setError("⚠️ Missing email or token.");
      return;
    }

    try {
      await resetPassword(email, token, newPassword);
      setMessage("✅ Your password has been successfully reset.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("❌ Reset error:", err);
      setError(
        "⚠️ Error resetting password. The link may be invalid or expired."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold">Reset password</h2>

      {message && (
        <div className="p-2 rounded bg-green-100 text-green-700 border border-green-300">
          {message}
        </div>
      )}
      {error && (
        <div className="p-2 rounded bg-red-100 text-red-700 border border-red-300">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-1 text-sm">New password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <button type="submit" className="p-2 bg-blue-600 text-white rounded">
        Reset
      </button>
    </form>
  );
}
