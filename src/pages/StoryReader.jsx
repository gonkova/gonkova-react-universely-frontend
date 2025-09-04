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
    totalPassages,
    allPassages,
  } = useStoryPlayer(id);

  const progressPercent = totalPassages
    ? Math.round((history.length / totalPassages) * 100)
    : 0;

  useEffect(() => {
    console.log("📌 Current passage:", current);
    console.log(
      "📝 History IDs:",
      history.map((p) => p.id)
    );
    console.log("📚 All passages JSON:", JSON.stringify(allPassages, null, 2));
  }, [current, history, allPassages]);

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
      <div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Passages read: {history.length}/{totalPassages}
          {isEnded ? " (reached the end)" : ""}
        </p>
      </div>

      <Button variant="secondary" onClick={() => navigate(-1)}>
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
                <div className="grid gap-3">
                  {(passage.choices || []).map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => choose(ch)}
                      disabled={loading}
                      className="
                        p-4 rounded-xl border border-gray-200 dark:border-gray-700 
                        bg-white dark:bg-blue-800 
                        text-left text-gray-900 dark:text-gray-100 
                        shadow-sm hover:shadow-md 
                        transition-transform duration-200 
                        hover:-translate-y-1 active:scale-95
                        flex items-center gap-3
                      "
                    >
                      <span className="text-lg">✨</span>
                      <span className="text-base">{ch.description}</span>
                    </button>
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
    </div>
  );
}
