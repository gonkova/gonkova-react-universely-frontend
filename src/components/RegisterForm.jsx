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

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password.length < 6) {
      setError("Паролата трябва да е поне 6 символа.");
      setLoading(false);
      return;
    }

    try {
      await register(form.email, form.userName, form.password);

      const result = await login(form.email, form.password);

      if (result.success) {
        navigate("/profile");
      } else {
        setError("Регистрацията беше успешна, но входът се провали.");
      }
    } catch (err) {
      const code = err.response?.data?.errors?.[0]?.code;
      if (code === "DuplicateUserName") {
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
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm">Потребителско име</label>
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
        <label className="block mb-1 text-sm">Парола (мин. 6 символа)</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
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
