import { useEffect, useState } from "react";
import { getStories } from "../services/api";

export default function StoryList({ onSelectStory }) {
  const [stories, setStories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getStories();
        setStories(data.items || []); // ✅ безопасно извличане
      } catch (err) {
        setError("Грешка при зареждане на историите");
        console.error(err);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Списък с истории</h2>
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2">
        {stories.map((story) => (
          <li
            key={story.id}
            onClick={() => onSelectStory(story.id)}
            className="cursor-pointer p-3 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <strong>{story.title || "Без заглавие"}</strong>
            <p className="text-sm text-gray-500">{story.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
