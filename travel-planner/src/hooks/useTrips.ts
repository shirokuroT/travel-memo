import { useEffect, useState } from "react";
import type { Trip } from "../types/Trip";

const STORAGE_KEY = "trips";

export const useTrips = () => {
  const [trips, setTrips] =
  useState<Trip[]>(() => {
    const savedTrips =
      localStorage.getItem(STORAGE_KEY);

    if (savedTrips) {
      return JSON.parse(savedTrips);
    }

    return [];
  });

  useEffect(() => {
  console.log("保存対象", trips);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(trips)
  );
}, [trips]);

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
          },
        ];

  for (let i = 1; i <= diffDays; i++) {
    pages.push({
      id: crypto.randomUUID(),
      title: `${i}日目`,
      memo: "",
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

  const deleteTrip = (id: string) => {
    setTrips((prev) =>
      prev.filter((trip) => trip.id !== id)
    );
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