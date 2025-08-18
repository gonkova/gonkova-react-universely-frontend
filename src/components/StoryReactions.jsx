import { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  getStoryDetailsById,
  storyReactions,
  ReactionType,
} from "@/services/api";

export default function StoryReactions({
  storyId,
  initialUserReaction = null,
}) {
  const { accessToken } = useContext(AuthContext);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(initialUserReaction);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const canVote = useMemo(
    () => Boolean(accessToken) && userReaction == null,
    [accessToken, userReaction]
  );

  // --- Load reactions, with optional cache ---
  const loadReactions = async () => {
    try {
      const data = await getStoryDetailsById(storyId);
      setLikes(data?.likeCount ?? 0);
      setDislikes(data?.dislikeCount ?? 0);
      if (data?.userReactionType != null)
        setUserReaction(data.userReactionType);
      setError(null);
    } catch {
      setError("Failed to load reactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!storyId) return;

    // Load initially
    loadReactions();

    // Auto-refresh every 30s
    const interval = setInterval(loadReactions, 30000);
    return () => clearInterval(interval);
  }, [storyId]);

  const handleReaction = async (reactionType) => {
    if (!canVote || sending) return;

    // Optimistic UI
    const previousLikes = likes;
    const previousDislikes = dislikes;
    setUserReaction(reactionType);
    setLikes(likes + (reactionType === ReactionType.Like ? 1 : 0));
    setDislikes(dislikes + (reactionType === ReactionType.Dislike ? 1 : 0));
    setSending(true);

    try {
      await storyReactions(storyId, reactionType);
      await loadReactions();
    } catch {
      // Rollback on error
      setUserReaction(null);
      setLikes(previousLikes);
      setDislikes(previousDislikes);
      setError("Failed to submit reaction. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading…</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div className="flex gap-6 items-center">
      <button
        disabled={!canVote || sending}
        onClick={() => handleReaction(ReactionType.Like)}
        className={`text-red-500 text-lg transition-transform hover:scale-110 ${
          userReaction === ReactionType.Like ? "opacity-70 font-bold" : ""
        } ${!canVote ? "cursor-not-allowed opacity-60" : ""}`}
      >
        ❤️ {likes}
      </button>

      <button
        disabled={!canVote || sending}
        onClick={() => handleReaction(ReactionType.Dislike)}
        className={`text-blue-500 text-lg transition-transform hover:scale-110 ${
          userReaction === ReactionType.Dislike ? "opacity-70 font-bold" : ""
        } ${!canVote ? "cursor-not-allowed opacity-60" : ""}`}
      >
        👎 {dislikes}
      </button>

      {userReaction != null && (
        <span className="text-xs text-gray-500">You have already voted.</span>
      )}
    </div>
  );
}
