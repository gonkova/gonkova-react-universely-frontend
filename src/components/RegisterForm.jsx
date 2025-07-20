import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Button from "./Button";

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    userName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one digit.";
    }
    if (!/[^\w\s]/.test(password)) {
      return "Password must contain at least one special character.";
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      await register(form.email, form.userName, form.password);

      const result = await login(form.email, form.password);

      if (result.success) {
        navigate("/profile");
      } else {
        setError("Registration succeeded but login failed.");
      }
    } catch (err) {
      const code = err.response?.data?.errors?.[0]?.code;
      if (code === "DuplicateUserName") {
        setError("Email or username already exists.");
      } else {
        setError(
          err.response?.data?.detail || "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block mb-1 text-sm">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm">Username</label>
        <input
          type="text"
          name="userName"
          value={form.userName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm">
          Password (min. 6 characters, at least 1 uppercase letter, 1 digit, 1
          special character)
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-sm text-gray-600 dark:text-gray-300"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
