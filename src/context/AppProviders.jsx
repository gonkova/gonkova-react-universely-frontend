import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      {" "}
      {/* 💡 Outermost */}
      <AuthProvider>
        {" "}
        {/* inside */}
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
