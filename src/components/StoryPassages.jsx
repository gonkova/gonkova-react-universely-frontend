import { useEffect, useState } from "react";
import { getPassages } from "../services/api"; // ✅ Коригиран import

export default function StoryPassages({ storyId }) {
  const [passages, setPassages] = useState([]);

  useEffect(() => {
    const fetchPassages = async () => {
      try {
        const data = await getPassages(storyId, 1, 5);
        setPassages(data); // ако е [{...}, {...}], това е ок
      } catch (err) {
        console.error("Грешка при зареждане на пасажи:", err);
      }
    };
    fetchPassages();
  }, [storyId]);

  return (
    <div className="p-4">
      {passages.map((p) => (
        <div key={p.id} className="mb-4 p-4 bg-white shadow rounded">
          <p>{p.content}</p>
        </div>
      ))}
    </div>
  );
}
