import { useEffect, useRef, useState, useCallback } from "react";
import {
  startStory,
  updateStoryProgress,
  getPassagesFrom,
} from "@/services/api";

export function useStoryPlayer(storyId) {
  const [allPassages, setAllPassages] = useState([]);
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);

  // track mounting
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setError(null);
  }, [storyId]);

  useEffect(() => {
    if (!storyId) return;

    setAllPassages([]);
    setHistory([]);
    setCurrent(null);
    setError(null);

    const loadAll = async () => {
      setLoading(true);
      setError(null);

      try {
        // === Checking if he can play  ===
        let startResp;
        try {
          startResp = await startStory(storyId);
          console.log("[useStoryPlayer.loadAll] startStory:", startResp);
        } catch (e) {
          const problem = e?.response?.data;
          const detail = problem?.detail || e.message || "Unknown error";

          console.warn("[useStoryPlayer.loadAll] startStory failed:", problem);

          if (isMounted.current) {
            setError(new Error(detail));
          }
          return;
        }

        // === passages===
        const data = await getPassagesFrom(storyId, null, 999);
        const passages =
          data?.passages || data?.items || data?.data?.passages || [];

        if (!isMounted.current) return;

        setAllPassages(passages);

        if (passages.length) {
          const first =
            passages.find((p) => (p.type || "").toLowerCase() === "starting") ||
            passages[0];

          setCurrent(first);
          setHistory([first]);
        }
      } catch (e) {
        if (!isMounted.current) return;
        console.error("[useStoryPlayer.loadAll] error:", e);
        setError(e);
      } finally {
        if (!isMounted.current) return;
        setLoading(false);
      }
    };

    loadAll();
  }, [storyId]);

  const mergePassages = useCallback((prev, nextBatch) => {
    const map = new Map(prev.map((p) => [p.id, p]));
    for (const p of nextBatch || []) {
      if (!map.has(p.id)) map.set(p.id, p);
    }
    return Array.from(map.values());
  }, []);

  const fetchNextPassageIfMissing = useCallback(
    async (wantedId) => {
      let found =
        allPassages.find((p) => p.id === wantedId) ||
        allPassages.find((p) => p._id === wantedId) ||
        allPassages.find((p) => p.slug === wantedId);

      if (found) return found;

      let fromId = allPassages[allPassages.length - 1]?.id ?? null;
      let safety = 0;

      while (safety < 50) {
        const page = await getPassagesFrom(storyId, fromId, 25);
        const batch = page?.passages || [];
        const hasMore = !!page?.hasMore;

        if (!isMounted.current) return null;
        if (!batch.length) break;

        setAllPassages((prev) => mergePassages(prev, batch));

        found =
          batch.find((p) => p.id === wantedId) ||
          batch.find((p) => p._id === wantedId) ||
          batch.find((p) => p.slug === wantedId);

        if (found) return found;

        fromId = batch[batch.length - 1]?.id ?? fromId;
        safety += 1;

        if (!hasMore) break;
      }

      return null;
    },
    [allPassages, storyId, mergePassages]
  );

  const choose = useCallback(
    async (choice) => {
      if (!current || !choice) return;
      setLoading(true);
      setError(null);

      try {
        console.log("[useStoryPlayer.choose] current:", current);
        console.log("[useStoryPlayer.choose] choice:", choice);

        await updateStoryProgress(storyId, current.id, choice.id);

        const nextId = choice?.nextPassageId || choice?.next_passage_id || null;
        console.log("[useStoryPlayer.choose] resolved nextId:", nextId);

        if (!nextId) {
          console.log("[useStoryPlayer.choose] no nextId -> probably end");
          return;
        }

        let next =
          allPassages.find(
            (p) => p.id === nextId || p._id === nextId || p.slug === nextId
          ) || (await fetchNextPassageIfMissing(nextId));

        if (!next) {
          console.error(
            "[useStoryPlayer.choose] next passage not found after paging:",
            nextId
          );
          setError(new Error("Next passage not found"));
          return;
        }

        setCurrent(next);
        setHistory((prev) => [...prev, next]);
      } catch (e) {
        console.error("[useStoryPlayer.choose] error:", e);
        setError(e);
      } finally {
        if (!isMounted.current) return;
        setLoading(false);
      }
    },
    [storyId, current, allPassages, fetchNextPassageIfMissing]
  );

  const loadNextPage = useCallback(() => {
    if (history.length < allPassages.length) {
      const nextBatch = allPassages.slice(history.length, history.length + 5);
      console.log("[useStoryPlayer.loadNextPage] batch:", nextBatch);
      setHistory((prev) => [...prev, ...nextBatch]);
      setCurrent(nextBatch[nextBatch.length - 1]);
    }
  }, [allPassages, history]);

  const isEnded =
    !loading &&
    !!current &&
    ((current.type || "").toLowerCase() === "ending" ||
      (current.choices || []).length === 0);

  const hasMore = history.length < allPassages.length;

  return {
    current,
    history,
    loading,
    error,
    choose,
    isEnded,
    hasMore,
    loadNextPage,
    totalPassages: allPassages.length,
    allPassages,
  };
}
