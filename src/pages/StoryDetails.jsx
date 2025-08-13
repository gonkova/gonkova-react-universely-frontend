import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStoryDetailsById } from "@/services/api";
import Button from "@/components/ui/Button";
import Reactions from "@/components/Reactions";
import Spinner from "@/components/ui/Spinner";

export default function StoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !accessToken) return;

    async function fetchStory() {
      try {
        const data = await getStoryDetailsById(id, accessToken);
        console.log("✅ Story from backend:", data);
        setStory(data);
        setError(null);
      } catch (err) {
        setError("Error loading history.");
      } finally {
        setLoading(false);
      }
    }

    fetchStory();
  }, [id, accessToken]);

  if (loading) return <Spinner />;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!story) return <div className="text-center mt-10">Story not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <Button variant="secondary" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {story.name}
      </h1>

      {story.imageUrl && (
        <img
          src={story.imageUrl}
          alt={story.name}
          className="w-full max-h-[400px] object-cover rounded"
        />
      )}

      <p className="mt-4 text-gray-700 dark:text-gray-300">
        {story.description}
      </p>

      {story.genres?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mt-4 mb-2">
            Genres:
          </h3>
          <div className="flex flex-wrap gap-2">
            {story.genres.map((genre) => (
              <span
                key={genre.name}
                className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-white"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Добавена: {new Date(story.addedAtUtc).toLocaleDateString()}
      </p>

      <Reactions storyId={story.id} accessToken={accessToken} />
    </div>
  );
}
