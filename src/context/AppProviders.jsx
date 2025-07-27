import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

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
