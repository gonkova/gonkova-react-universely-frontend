import { useState, useEffect } from "react";
import Spinner from "@/components/ui/Spinner";
import Pagination from "@/components/ui/Pagination";
import { Link } from "react-router-dom";
import GenreList from "@/components/genres/GenreList";
import GenreFilter from "@/components/genres/GenreFilter";
import { useStories } from "@/hooks/useStories";

export default function StoryList() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);

  const { stories, totalPages, loading, error } = useStories(
    selectedGenres,
    page
  );

  useEffect(() => setPage(1), [selectedGenres]);

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
                onChange={setSelectedGenres}
              />
              {selectedGenres.length > 0 && (
                <button
                  onClick={() => setSelectedGenres([])}
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
              className="block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ textDecoration: "none" }}
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

                    {story.genres?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {story.genres.map((g, i) => {
                          const name =
                            typeof g === "string"
                              ? g
                              : g.name ?? g.title ?? String(g);
                          return (
                            <span
                              key={name + i}
                              className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-white transition-colors duration-200 hover:bg-blue-200 dark:hover:bg-blue-700"
                            >
                              {name}
                            </span>
                          );
                        })}
                      </div>
                    )}
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
