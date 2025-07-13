import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { accessToken } = useContext(AuthContext);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
