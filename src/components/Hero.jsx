import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

const phrases = [
  "Dive into your imagination.",
  "Choose. Explore. Create.",
  "Interactive storytelling like never before.",
];

export default function Hero() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = "/images/story6.png";
    img.onload = () => setBgLoaded(true);
  }, []);

  if (!bgLoaded) return <Spinner />;

  return (
    <section
      className="h-screen flex items-center justify-center px-6 bg-cover bg-center transition-colors duration-500"
      style={{
        backgroundImage: "url('/images/story6.png')",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative bg-white/60 dark:bg-black/60 backdrop-blur-md p-8 sm:p-12 rounded-2xl text-white text-center max-w-2xl w-full overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-1/2 h-full bg-black/20 dark:bg-white/20 blur-xl animate-slide" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight font-heading relative z-10">
          Welcome to <span className="text-blue-500">Universely</span>
        </h1>

        <div className="min-h-[3rem] mb-8 text-lg text-blue-100 font-body relative z-10">
          <AnimatePresence mode="wait">
            <motion.p
              key={phrases[index]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {phrases[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/register")}
            className="hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/login")}
            className="hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            Log In
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
