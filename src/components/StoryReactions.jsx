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

  // ⚡️ Load reactions only once per story
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await getStoryDetailsById(storyId);
        if (!isMounted) return;
        setLikes(data?.likeCount ?? 0);
        setDislikes(data?.dislikeCount ?? 0);
        setUserReaction(data?.userReactionType ?? null);
        setError(null);
      } catch {
        if (!isMounted) return;
        setError("Failed to load reactions.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [storyId]);

  const handleReaction = async (reactionType) => {
    if (!canVote || sending) return;

    const prevLikes = likes;
    const prevDislikes = dislikes;

    // Optimistic UI update
    setUserReaction(reactionType);
    setLikes(likes + (reactionType === ReactionType.Like ? 1 : 0));
    setDislikes(dislikes + (reactionType === ReactionType.Dislike ? 1 : 0));
    setSending(true);

    try {
      // storyReactions should return updated counts
      const data = await storyReactions(storyId, reactionType);
      setLikes(data?.likeCount ?? likes);
      setDislikes(data?.dislikeCount ?? dislikes);
      setError(null);
    } catch {
      // Rollback on error
      setUserReaction(null);
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      setError("Failed to submit reaction. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading…</div>;

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

      {userReaction && (
        <span className="text-xs text-gray-500">You have already voted.</span>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
}
