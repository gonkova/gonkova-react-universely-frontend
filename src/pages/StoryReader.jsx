// src/pages/StoryReader.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useStoryPlayer } from "@/hooks/useStoryPlayer";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";

export default function StoryReader() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { history, current, loading, error, reload, choose, isEnded } =
    useStoryPlayer(id);

  // DEBUG (по желание остави)
  useEffect(() => {
    console.log("📌 Current passage:", current);
    console.log("📝 History:", history);
  }, [current, history]);

  // 1) Истинска грешка
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">Възникна грешка при зареждане.</div>
        <Button variant="secondary" onClick={reload}>
          🔄 Опитай пак
        </Button>
      </div>
    );
  }

  // 2) Първоначално зареждане (още нямаме current)
  if (!current) {
    return (
      <div className="p-10 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // 3) Основен рендер
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
        className="transition-transform hover:-translate-x-1 hover:scale-105"
      >
        ← Back
      </Button>

      {/* История на пасажите */}
      <div className="space-y-6">
        {history.map((passage, idx) => {
          const isLast = idx === history.length - 1;

          return (
            <article
              key={passage.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              {/* Текст на пасажа */}
              <div className="whitespace-pre-line text-lg leading-relaxed text-gray-900 dark:text-gray-100">
                {passage.narrative}
              </div>

              {/* Избори – само за последния пасаж и ако не е край */}
              {isLast && !isEnded && (
                <div className="mt-6 grid gap-3">
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

              {/* Край на историята */}
              {isLast && isEnded && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md text-green-800 dark:text-green-100">
                  Край на историята. Благодаря, че игра! ✨
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Индикатор, че мислим за следващия пасаж, но НЕ скриваме съдържанието */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Spinner size="sm" /> мисля...
        </div>
      )}
    </div>
  );
}
