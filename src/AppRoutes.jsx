import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Stories from "./pages/Stories";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Register from "./pages/Register";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ResetPasswordForm from "./components/ResetPasswordForm";

const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/stories", element: <Stories /> },
  { path: "/forgot-password", element: <ForgotPasswordForm /> },
  { path: "/reset-password", element: <ResetPasswordForm /> },
  { path: "/success", element: <Success /> },
  { path: "/cancel", element: <Cancel /> },
  { path: "*", element: <NotFound /> },
];

const protectedRoutes = [{ path: "/profile", element: <Profile /> }];

export default function AppRoutes() {
  return (
    <Routes>
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<Layout>{element}</Layout>} />
      ))}

      {protectedRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <Layout>{element}</Layout>
            </ProtectedRoute>
          }
        />
      ))}
    </Routes>
  );
}
