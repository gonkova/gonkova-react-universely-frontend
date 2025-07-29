import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function StoryDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const story = state?.story;

  if (!story) {
    return (
      <div className="text-center text-red-500 mt-10">
        Историята не е намерена.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <Button variant="secondary" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <h1 className="text-2xl font-bold dark:text-white text-gray-900">
        {story.title}
      </h1>

      {story.imageUrl && (
        <img
          src={story.imageUrl}
          alt={story.title}
          loading="lazy"
          className="w-full max-h-[400px] object-contain rounded-md transition-transform duration-300 ease-in-out hover:scale-110 active:scale-95 hover:cursor-pointer"
          style={{ userSelect: "none" }}
        />
      )}

      <p className="text-gray-700 dark:text-gray-300 mt-4">
        {story.description}
      </p>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Added: {new Date(story.addedAtUtc).toLocaleDateString()}
      </p>
    </div>
  );
}
