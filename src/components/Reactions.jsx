import { useState } from "react";
import { storyReactions } from "@/services/api";

export default function Reactions({ storyId, accessToken }) {
  const [reactionSent, setReactionSent] = useState(null);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  async function handleReaction(type) {
    try {
      await storyReactions(storyId, type, accessToken);
      setReactionSent(type);

      if (type === 1) setLikes((prev) => prev + 1);
      if (type === 2) setDislikes((prev) => prev + 1);

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Неуспешна реакция. Опитайте отново.");
    }
  }

  return (
    <div className="pt-6 flex gap-6 items-center">
      <button
        onClick={() => handleReaction(1)}
        className={`text-red-500 text-lg transition-transform hover:scale-110 ${
          reactionSent === 1 ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        ❤️ {reactionSent === 1 ? "Thanks!" : "Like"} ({likes})
      </button>

      <button
        onClick={() => handleReaction(2)}
        className={`text-blue-500 text-lg transition-transform hover:scale-110 ${
          reactionSent === 2 ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        👎 {reactionSent === 2 ? "Got it!" : "Dislike"} ({dislikes})
      </button>

      {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
    </div>
  );
}
