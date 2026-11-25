import { useCallback, useEffect, useRef, useState } from "react";
import type { Trip } from "../types/Trip";
import { supabase } from "../lib/supabase";
import { createPages } from "../lib/tripPages";

/** 入力が止まってから保存するまでの待ち時間 */
const SAVE_DELAY_MS = 800;

export type SaveStatus =
  | "saved"
  | "pending"
  | "saving"
  | "error";

const upsertTrip = async (trip: Trip) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { error } = await supabase.from("trips").upsert({
    id: trip.id,
    user_id: session?.user.id,
    title: trip.title,
    data: trip,
  });

  if (error) {
    console.error("旅行の保存に失敗しました", error);
  }

  return !error;
};

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] =
    useState<SaveStatus>("saved");

  // 旅行IDごとの保存待ちの最新版・タイマー・送信中の保存・失敗
  const pendingRef = useRef(new Map<string, Trip>());
  const timersRef = useRef(new Map<string, number>());
  const inFlightRef = useRef(new Map<string, Promise<boolean>>());
  const failedRef = useRef(new Set<string>());

  const refreshStatus = useCallback(() => {
    if (failedRef.current.size > 0) {
      setSaveStatus("error");
    } else if (inFlightRef.current.size > 0) {
      setSaveStatus("saving");
    } else if (pendingRef.current.size > 0) {
      setSaveStatus("pending");
    } else {
      setSaveStatus("saved");
    }
  }, []);

  // 同じ旅行の保存は1件ずつ送り、送信中に来た変更は終わってから最新版を送る
  const flush = useCallback(
    async (id: string): Promise<void> => {
      const timer = timersRef.current.get(id);
      if (timer !== undefined) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }

      for (;;) {
        const running = inFlightRef.current.get(id);
        if (running) {
          await running;
          continue;
        }

        const trip = pendingRef.current.get(id);
        if (!trip) return;

        pendingRef.current.delete(id);

        const request = (async () => {
          const ok = await upsertTrip(trip);

          if (ok) {
            failedRef.current.delete(id);
          } else {
            failedRef.current.add(id);
            // 新しい変更がなければ、再試行できるよう保存待ちに戻す
            if (!pendingRef.current.has(id)) {
              pendingRef.current.set(id, trip);
            }
          }

          return ok;
        })();

        inFlightRef.current.set(id, request);
        refreshStatus();

        const ok = await request;

        inFlightRef.current.delete(id);
        refreshStatus();

        // 失敗したら止める（「保存」ボタンで再試行）。成功して新しい変更があれば続けて送る
        if (!ok) return;
      }
    },
    [refreshStatus]
  );

  const flushAll = useCallback(async () => {
    await Promise.all(
      [...pendingRef.current.keys()].map((id) =>
        flush(id)
      )
    );
  }, [flush]);

  const scheduleSave = useCallback(
    (trip: Trip) => {
      pendingRef.current.set(trip.id, trip);

      const timer = timersRef.current.get(trip.id);
      if (timer !== undefined) clearTimeout(timer);

      timersRef.current.set(
        trip.id,
        window.setTimeout(() => {
          void flush(trip.id);
        }, SAVE_DELAY_MS)
      );

      refreshStatus();
    },
    [flush, refreshStatus]
  );

  useEffect(() => {
    const loadTrips = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", session.user.id);

      setIsLoading(false);

      if (error) {
        console.error(error);
        return;
      }

      setTrips(data.map((row) => row.data as Trip));
    };

    loadTrips();
  }, []);

  // 未保存の変更があるときは、画面を離れる前に保存する
  useEffect(() => {
    const handleBeforeUnload = (
      e: BeforeUnloadEvent
    ) => {
      if (
        pendingRef.current.size > 0 ||
        inFlightRef.current.size > 0
      ) {
        void flushAll();
        e.preventDefault();
      }
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
      void flushAll();
    };
  }, [flushAll]);

  const addTrip = (
    title: string,
    startDate: string,
    endDate: string
  ) => {
    const newTrip: Trip = {
      id: crypto.randomUUID(),
      title,
      startDate,
      endDate,
      pages: createPages(startDate, endDate),
    };

    setTrips((prev) => [...prev, newTrip]);

    pendingRef.current.set(newTrip.id, newTrip);
    void flush(newTrip.id);
  };

  const updateTrip = (updatedTrip: Trip) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === updatedTrip.id ? updatedTrip : trip
      )
    );

    scheduleSave(updatedTrip);
  };

  const deleteTrip = async (id: string) => {
    const deletedTrip = trips.find((trip) => trip.id === id);

    // 保存待ちを取り消し、送信中の保存が終わってから削除する（削除後に復活しないように）
    const timer = timersRef.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    pendingRef.current.delete(id);
    failedRef.current.delete(id);
    refreshStatus();

    // 先に画面から消し、Supabaseの削除に失敗したら元に戻す
    setTrips((prev) =>
      prev.filter((trip) => trip.id !== id)
    );

    await inFlightRef.current.get(id);

    const { error } = await supabase
      .from("trips")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("旅行の削除に失敗しました", error);
      if (deletedTrip) {
        setTrips((prev) => [...prev, deletedTrip]);
      }
      alert("旅行の削除に失敗しました。もう一度お試しください。");
    }
  };

  return {
    trips,
    isLoading,
    saveStatus,
    saveNow: flushAll,
    addTrip,
    deleteTrip,
    updateTrip,
  };
};
