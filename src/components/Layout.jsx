import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="p-6 max-w-5xl mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
