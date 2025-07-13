import React, { useEffect, useState } from "react";
import { getStories } from "../services/universelyApi";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStories()
      .then(setStories)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-500">Грешка: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Истории</h1>
      <ul className="space-y-2">
        {stories.map((story) => (
          <li
            key={story.id}
            className="p-2 bg-gray-100 rounded dark:bg-gray-800"
          >
            {story.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
