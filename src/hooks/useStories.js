import { useState, useEffect, useContext } from "react";
import { getStories } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";

export function useStories(selectedGenres, page, pageSize = 5) {
  const { accessToken } = useContext(AuthContext);
  const [stories, setStories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedGenres = useDebounce(selectedGenres, 1000);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      setError("Please log in to see stories.");
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    getStories(page, pageSize, debouncedGenres, controller.signal)
      .then((data) => {
        setStories(data?.items || []);
        setTotalPages(data?.totalPages || 1);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError(err.message || "Error loading stories");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [page, pageSize, debouncedGenres, accessToken]);

  return { stories, totalPages, loading, error };
}
