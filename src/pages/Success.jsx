import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/profile");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Payment successful!
      </h1>
      <p className="text-gray-700 mb-4">
        Thank you for your subscription. You’ll be redirected shortly.
      </p>
      <p className="text-sm text-gray-500">
        If you are not redirected automatically,{" "}
        <button
          onClick={() => navigate("/profile")}
          className="text-purple-600 underline"
        >
          click here
        </button>
        .
      </p>
    </div>
  );
}
