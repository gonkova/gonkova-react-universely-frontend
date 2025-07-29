import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "@/context/ThemeContext";
import { AuthContext } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Stories", path: "/stories" },
  { name: "Pricing", path: "/pricing" },
  { name: "Profile", path: "/profile" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { accessToken, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpen(false);
  };

  return (
    <header className="bg-gray-200 dark:bg-gray-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Logo size="text-2xl" />

        {/* Desktop menu */}
        <nav className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-900 dark:text-white hover:underline"
            >
              {item.name}
            </Link>
          ))}

          {accessToken ? (
            <Button onClick={handleLogout} variant="secondary">
              Log out
            </Button>
          ) : (
            <Link
              to="/login"
              className="text-gray-900 dark:text-white hover:underline"
            >
              Login
            </Link>
          )}

          <Button onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Light Theme" : "🌙 Dark theme"}
          </Button>
        </nav>

        {/* Mobile button */}
        <button
          className="md:hidden text-gray-900 dark:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-gray-200 dark:bg-gray-800">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className="block text-gray-900 dark:text-white hover:underline"
            >
              {item.name}
            </Link>
          ))}

          {accessToken ? (
            <Button onClick={handleLogout} variant="secondary">
              Log out
            </Button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block text-gray-900 dark:text-white hover:underline"
            >
              Login
            </Link>
          )}

          <Button onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Light Theme" : "🌙 Dark Theme"}
          </Button>
        </div>
      )}
    </header>
  );
}
