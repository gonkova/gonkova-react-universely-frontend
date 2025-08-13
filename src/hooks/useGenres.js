import { useState, useEffect, useContext } from "react";
import { getGenres } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";

export function useGenres() {
  const { accessToken } = useContext(AuthContext);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      setError("Please log in to see genres.");
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    getGenres(controller.signal)
      .then((data) => setGenres(data || []))
      .catch((e) => {
        if (e.name !== "CanceledError" && e.name !== "AbortError") {
          setError("Could not load genres.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [accessToken]);

  return { genres, loading, error };
}
