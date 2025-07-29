import React, { useEffect, useState } from "react";
import { getStories } from "@/services/api";
import Spinner from "@/components/ui/Spinner";
import Pagination from "./ui/Pagination";
import { Link } from "react-router-dom";

export default function StoryList() {
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getStories(page, pageSize);
        setStories(data.items || []);
        setTotalPages(data.totalPages || 1);
        setError(null);
      } catch (err) {
        setError(err.message || "Error loading stories");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className="max-w-xl mx-auto mt-10 text-center text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {stories.map((story) => (
        <Link
          to={`/story/${story.id}`}
          state={{ story }}
          key={story.id}
          className="block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ textDecoration: "none" }}
        >
          <div className="flex flex-col md:flex-row">
            {story.imageUrl && (
              <img
                src={story.imageUrl}
                alt={`Image for ${story.title}`}
                loading="lazy"
                className="w-full md:w-48 h-48 object-cover rounded-l-xl transition-transform duration-300 ease-in-out hover:scale-105"
                style={{ userSelect: "none" }}
              />
            )}
            <div className="p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {story.title}
                </h2>
                <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                  {story.description}
                </p>
              </div>
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Added: {new Date(story.addedAtUtc).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
