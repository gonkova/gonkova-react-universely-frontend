import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Вход</h1>
      <LoginForm />

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        Нямаш акаунт?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Регистрирай се
        </Link>
      </p>
    </div>
  );
}
