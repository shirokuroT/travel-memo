import { useEffect, useState } from "react";
import type { Trip } from "../types/Trip";
import { supabase } from "../lib/supabase";

const STORAGE_KEY = "trips";

export const useTrips = () => {
  const [trips, setTrips] =
  useState<Trip[]>([]);

 useEffect(() => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(trips)
  );

 const saveTrips = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  for (const trip of trips) {
    const { data, error } =
      await supabase
        .from("trips")
        .upsert({
          id: trip.id,
          user_id: user?.id,
          title: trip.title,
          data: trip,
        });

    console.log("data", data);
    console.log("error", error);
  }
};

  saveTrips();
}, [trips]);

useEffect(() => {
  const loadTrips = async () => {
    const {
  data: { user },
} = await supabase.auth.getUser();

const { data, error } =
  await supabase
    .from("trips")
    .select("*")
    .eq("user_id", user?.id);

    if (error) {
      console.error(error);
      return;
    }

    const loadedTrips =
      data.map((row) => row.data as Trip);

    setTrips(loadedTrips);
  };

  loadTrips();
}, []);

  const createPages = (
        startDate: string,
        endDate: string
    ) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const diffDays =
          Math.floor(
            (end.getTime() - start.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

        const pages = [
          {
            id: crypto.randomUUID(),
            title: "共通",
            memo: "",
            links: [],
          },
        ];

  for (let i = 1; i <= diffDays; i++) {
    pages.push({
      id: crypto.randomUUID(),
      title: `${i}日目`,
      memo: "",
      links: [],
    });
  }

  return pages;
};

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

  console.log("追加", newTrip);

  setTrips((prev) => [...prev, newTrip]);
};

  const deleteTrip = async (id: string) => {
    const deletedTrip = trips.find((trip) => trip.id === id);

    // 先に画面から消し、Supabaseの削除に失敗したら元に戻す
    setTrips((prev) =>
      prev.filter((trip) => trip.id !== id)
    );

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

  const updateTrip = (updatedTrip: Trip) => {
  setTrips((prev) =>
    prev.map((trip) =>
      trip.id === updatedTrip.id
        ? updatedTrip
        : trip
    )
  );
};

  

  return {
  trips,
  addTrip,
  deleteTrip,
  updateTrip,
};
};