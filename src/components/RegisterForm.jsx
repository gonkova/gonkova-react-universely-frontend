import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import { AuthContext } from "../context/AuthContext";
import Button from "./Button";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Паролата трябва да е поне 6 символа.");
      setLoading(false);
      return;
    }

    try {
      await api.post(
        "/users/register",
        { email, userName, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Automatic login after successful registration
      const result = await login(email, password);
      if (result.success) {
        navigate("/profile");
      } else {
        setError("Регистрацията беше успешна, но входът се провали.");
      }
    } catch (err) {
      if (err.response?.data?.errors?.[0]?.code === "DuplicateUserName") {
        setError("Имейлът или потребителското име вече съществува.");
      } else {
        setError(
          err.response?.data?.detail ||
            "Грешка при регистрация. Опитайте отново."
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
        <label className="block mb-1 text-sm">Имейл</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm">Потребителско име</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm">Парола (мин. 6 символа)</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Регистрация..." : "Регистрация"}
      </Button>
    </form>
  );
}
