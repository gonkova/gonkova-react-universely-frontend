import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Payment was cancelled
      </h1>
      <p className="text-gray-700 mb-4">Your subscription was not completed.</p>
      <Link to="/pricing">
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Try Again
        </button>
      </Link>
    </div>
  );
}
