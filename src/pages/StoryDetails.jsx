import { useParams, useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/ui/Button";
import StoryReactions from "@/components/StoryReactions";

export default function StoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Историята винаги идва от state, когато идваш от списъка
  const story = location.state?.story || null;

  if (!story) {
    return (
      <div className="text-center mt-10 text-red-500">
        Story not found. Please go back to the list.
      </div>
    );
  }

  const title = story.title ?? story.name ?? "Untitled";
  const addedAt = story.addedAtUtc ?? story.createdAtUtc;
  const genres = Array.isArray(story.genres) ? story.genres : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
        className="transition-transform hover:-translate-x-1 hover:scale-105"
      >
        ← Back
      </Button>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>

      {story.imageUrl && (
        <img
          src={story.imageUrl}
          alt={title}
          className="w-full max-h-[400px] object-cover rounded transition-transform duration-300 hover:scale-105"
        />
      )}

      {story.description && (
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          {story.description}
        </p>
      )}

      {genres.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mt-4 mb-2">
            Genres:
          </h3>
          <div className="flex flex-wrap gap-2">
            {genres.map((g, i) => {
              const name =
                typeof g === "string" ? g : g.name ?? g.title ?? String(g);
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
        </div>
      )}

      {addedAt && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Added: {new Date(addedAt).toLocaleDateString()}
        </p>
      )}

      <div className="pt-6 space-y-4">
        <Button
          variant="primary"
          className="w-full sm:w-auto"
          onClick={() => navigate(`/stories/${id}/play`, { state: { story } })}
        >
          🎮 Start Story
        </Button>
        <StoryReactions
          storyId={story.id || id}
          initialUserReaction={story.userReactionType ?? null}
          initialLikes={story.likeCount ?? 0}
          initialDislikes={story.dislikeCount ?? 0}
        />
      </div>
    </div>
  );
}
