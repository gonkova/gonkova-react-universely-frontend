// components/StoryList.jsx
import { useState, useRef, useContext, useEffect } from "react";
import Spinner from "@/components/ui/Spinner";
import Pagination from "./ui/Pagination";
import { Link } from "react-router-dom";
import GenreList from "./genres/GenreList";
import GenreFilter from "./genres/GenreFilter";
import { getStories } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";

export default function StoryList() {
  const { accessToken } = useContext(AuthContext);

  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const debouncedGenres = useDebounce(selectedGenres, 1000);
  const cache = useRef({}); // кеширане на заявките

  const fetchStories = async () => {
    if (!accessToken) {
      setError("Please log in to see stories.");
      setLoading(false);
      return;
    }

    const key = JSON.stringify({ page, genres: debouncedGenres });
    if (cache.current[key]) {
      setStories(cache.current[key].items);
      setTotalPages(cache.current[key].totalPages);
      return;
    }

    setLoading(true);
    try {
      const data = await getStories(page, 5, debouncedGenres);
      cache.current[key] = {
        items: data.items || [],
        totalPages: data.totalPages || 1,
      };
      setStories(cache.current[key].items);
      setTotalPages(cache.current[key].totalPages);
      setError(null);
    } catch (err) {
      setError(err.message || "Error loading stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [page, debouncedGenres, accessToken]);

  const handleGenresChange = (newGenres) => {
    setSelectedGenres(newGenres);
    setPage(1); // избягваме отделен useEffect → няма двойно fetch-ване
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex gap-8">
      <aside className="w-64">
        <GenreList>
          {(genres) => (
            <>
              <GenreFilter
                genres={genres}
                selectedGenres={selectedGenres}
                onChange={handleGenresChange}
              />
              {selectedGenres.length > 0 && (
                <button
                  onClick={() => handleGenresChange([])}
                  className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Clear filters
                </button>
              )}
            </>
          )}
        </GenreList>
      </aside>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 space-y-6">
        {stories.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No stories found for the selected genres.
          </p>
        ) : (
          stories.map((story) => (
            <Link
              to={`/story/${story.id}`}
              state={{ story }}
              key={story.id}
              className="block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row">
                {story.imageUrl && (
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    loading="lazy"
                    className="w-full md:w-48 h-48 object-cover rounded-l-xl transition-transform duration-300 hover:scale-105"
                  />
                )}
                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{story.title}</h2>
                    <p className="mt-2 text-sm">{story.description}</p>
                  </div>
                  <p className="mt-4 text-xs text-gray-500">
                    Added: {new Date(story.addedAtUtc).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}
