import React, { useEffect, useState } from "react";
import { getStories } from "@/services/api";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getStories();
        setStories(data.items || []);
      } catch (err) {
        console.error("Error loading stories:", err);
        setError(err.message || "Error loading stories");
      }
    }

    fetchData();
  }, []);

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Stories</h1>
      <ul className="space-y-2">
        {stories.map((story) => (
          <li
            key={story.id}
            className="p-2 bg-gray-100 rounded dark:bg-gray-800"
          >
            <h2 className="font-semibold">{story.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {story.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
