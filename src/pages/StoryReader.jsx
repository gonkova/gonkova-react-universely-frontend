import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useStoryPlayer } from "@/hooks/useStoryPlayer";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";

export default function StoryReader() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    history,
    current,
    loading,
    error,
    reload,
    choose,
    isEnded,
    hasMore,
    loadNextPage,
  } = useStoryPlayer(id);

  // Progress calculation
  const progressPercent = isEnded
    ? 100
    : hasMore
    ? Math.min(history.length * 10, 95)
    : 100;

  // Debug
  useEffect(() => {
    console.log("📌 Current passage:", current);
    console.log(
      "📝 Full history:",
      history.map((p) => p.id)
    );
  }, [current, history]);

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">
          ⚠️ An error occurred while loading.
        </div>
        <Button variant="secondary" onClick={reload}>
          🔄 Try again
        </Button>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="p-10 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Progress bar */}
      <div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Passages read: {history.length}
          {isEnded ? " (reached the end)" : hasMore ? " (there is more…)" : ""}
        </p>
      </div>

      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
        className="transition-transform hover:-translate-x-1 hover:scale-105"
      >
        ← Back
      </Button>

      <div className="space-y-4">
        {history.map((passage, idx) => {
          const isLast = idx === history.length - 1;

          return (
            <div key={passage.id} className="space-y-2">
              <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <p className="whitespace-pre-line text-lg leading-relaxed text-gray-900 dark:text-gray-100">
                  {passage.narrative}
                </p>
              </div>

              {isLast && !isEnded && (
                <div className="flex flex-col gap-2">
                  {(passage.choices || []).map((ch) => (
                    <Button
                      key={ch.id}
                      variant="primary"
                      onClick={() => choose(ch)}
                      disabled={loading}
                      className="text-left"
                    >
                      {ch.description}
                    </Button>
                  ))}
                </div>
              )}

              {isLast && isEnded && (
                <div className="p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md text-green-800 dark:text-green-100">
                  End of story. Thanks for playing! ✨
                </div>
              )}
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Spinner size="sm" /> loading…
        </div>
      )}

      {!isEnded && hasMore && !loading && (
        <div className="flex justify-center mt-4">
          <Button variant="secondary" onClick={loadNextPage}>
            ⬇️ Load more passages
          </Button>
        </div>
      )}
    </div>
  );
}
