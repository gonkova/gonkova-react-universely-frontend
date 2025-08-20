// src/hooks/useStoryPlayer.js
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

  const isMounted = useRef(true);
  const requestIdRef = useRef(0); // за да игнорираме стари заявки при race

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Зарежда първия пасаж (или от given passageId ако подадем)
  const loadFrom = useCallback(
    async (fromPassageId = null) => {
      const reqId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      try {
        // опит за старт (ако вече е стартирана, бекендът може да върне 409/400 — игнорираме)
        try {
          await startStory(storyId);
          console.log("✅ Story started:", storyId);
        } catch {
          console.log("ℹ️ Story already started:", storyId);
        }

        const data = await getPassagesFrom(storyId, fromPassageId, 1);
        console.log("📥 Passages response:", data);

        const first = data?.passages?.[0] ?? null;
        console.log("📖 First passage candidate:", first);

        if (!isMounted.current || reqId !== requestIdRef.current) return;

        if (first) {
          setCurrent(first);
          setHistory(fromPassageId ? (prev) => [...prev, first] : [first]);
        } else {
          // няма пасаж – изчистваме current/history, но пазим loading/error логиката
          setCurrent(null);
          setHistory([]);
        }
      } catch (e) {
        console.error("❌ Error loading story:", e);
        if (!isMounted.current || reqId !== requestIdRef.current) return;
        setError(e);
      } finally {
        if (!isMounted.current || reqId !== requestIdRef.current) return;
        setLoading(false);
      }
    },
    [storyId]
  );

  // Авто-инициализация при смяна на storyId
  useEffect(() => {
    // НУЛИРАМЕ state само при смяна на историята
    setHistory([]);
    setCurrent(null);
    setError(null);
    loadFrom(null);
  }, [storyId, loadFrom]);

  // Избор на следващ пасаж
  const choose = useCallback(
    async (choice) => {
      if (!current || !choice) return;

      const reqId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      try {
        await updateStoryProgress(storyId, current.id, choice.id);

        const data = await getPassagesFrom(storyId, choice.nextPassageId, 1);
        const next = data?.passages?.[0] ?? null;

        if (!isMounted.current || reqId !== requestIdRef.current) return;

        if (next) {
          setCurrent(next);
          setHistory((prev) => [...prev, next]);
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
    [storyId, current]
  );

  // Публичен „reload“ – насилствено презареждане от началото
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
  };
}
