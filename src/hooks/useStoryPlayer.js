import { useCallback, useEffect, useRef, useState } from "react";
import {
  startStory,
  updateStoryProgress,
  getPassagesFrom,
} from "@/services/api";

export function useStoryPlayer(storyId) {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const isMounted = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Adds passages to history without duplicates
  const addToHistory = useCallback((passages) => {
    setHistory((prev) => {
      const filtered = passages.filter((p) => !prev.some((x) => x.id === p.id));
      if (filtered.length === 0) return prev;
      const updated = [...prev, ...filtered];
      console.log(
        "📝 Updated history:",
        updated.map((p) => p.id)
      );
      return updated;
    });
  }, []);

  const loadFrom = useCallback(
    async (fromPassageId = null, pageSize = 1) => {
      const reqId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      try {
        console.log("⏳ Loading story from passage:", fromPassageId);

        try {
          await startStory(storyId);
          console.log("✅ Story started:", storyId);
        } catch {
          console.log("ℹ️ Story already started:", storyId);
        }

        const data = await getPassagesFrom(storyId, fromPassageId, pageSize);
        console.log(
          "📥 Loaded passages from backend:",
          data.passages.map((p) => p.id)
        );

        if (!isMounted.current || reqId !== requestIdRef.current) return;

        if (data?.passages?.length) {
          const last = data.passages[data.passages.length - 1];
          setCurrent(last);
          addToHistory(data.passages);
        }

        setHasMore(data.hasMore ?? false);
      } catch (e) {
        console.error("❌ Error loading story:", e);
        if (!isMounted.current || reqId !== requestIdRef.current) return;
        setError(e);
      } finally {
        if (!isMounted.current || reqId !== requestIdRef.current) return;
        setLoading(false);
      }
    },
    [storyId, addToHistory]
  );

  useEffect(() => {
    console.log("🔄 Story changed, resetting state for:", storyId);
    setHistory([]);
    setCurrent(null);
    setError(null);
    setHasMore(false);

    loadFrom(null);
  }, [storyId, loadFrom]);

  const choose = useCallback(
    async (choice) => {
      if (!current || !choice) return;

      const reqId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      try {
        console.log("🎯 Chose:", choice.id, choice.description);

        await updateStoryProgress(storyId, current.id, choice.id);
        console.log("💾 Progress updated:", {
          storyId,
          lastPassageId: current.id,
          lastChoiceId: choice.id,
        });

        const data = await getPassagesFrom(storyId, choice.nextPassageId, 1);
        console.log(
          "📥 Next passage loaded from backend:",
          data.passages.map((p) => p.id)
        );

        if (!isMounted.current || reqId !== requestIdRef.current) return;

        if (data.passages?.length) {
          const last = data.passages[data.passages.length - 1];
          setCurrent(last);
          addToHistory(data.passages);
          setHasMore(data.hasMore ?? false);
        }
      } catch (e) {
        console.error("❌ Error choosing path:", e);
        if (!isMounted.current || reqId !== requestIdRef.current) return;
        setError(e);
      } finally {
        if (!isMounted.current || reqId !== requestIdRef.current) return;
        setLoading(false);
      }
    },
    [storyId, current, addToHistory]
  );

  const reload = useCallback(() => loadFrom(null), [loadFrom]);

  const isEnded =
    !loading &&
    !!current &&
    (current.type?.toLowerCase() === "ending" ||
      (current.choices || []).length === 0);

  return {
    current,
    history,
    loading,
    error,
    reload,
    choose,
    isEnded,
    hasMore,
    loadNextPage: useCallback(() => {
      if (hasMore && history.length) {
        const lastId = history[history.length - 1].id;
        loadFrom(lastId, 5);
      }
    }, [hasMore, history, loadFrom]),
  };
}
