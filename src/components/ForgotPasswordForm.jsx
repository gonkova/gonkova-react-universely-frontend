import { useState } from "react";
import { forgotPassword } from "../services/api";
import Button from "./Button";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setEmail("");

    if (!validateEmail(email)) {
      setError("⚠️ Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword(email);
      setMessage("✅ If this email exists, a reset link has been sent.");
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      setError("⚠️ Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold text-center">Forgot Password</h2>

      {message && (
        <div className="p-2 bg-green-100 border border-green-300 text-green-800 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-100 border border-red-300 text-red-800 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block mb-1 text-sm">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send reset email"}
      </Button>
    </form>
  );
}
