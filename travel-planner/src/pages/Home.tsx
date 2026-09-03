import { useState } from "react";

import { TripForm } from "../components/TripForm";
import { TripList } from "../components/TripList";

import { useTrips } from "../hooks/useTrips";
import type { Trip } from "../types/Trip";

export default function Home() {
  const [editingTrip, setEditingTrip] =
    useState<Trip | null>(null);

  const {
    trips,
    addTrip,
    deleteTrip,
    updateTrip,
  } = useTrips();

  return (
    <div className="container">
      <h1>✈️ Travel Memo</h1>

      <TripForm
        onAdd={addTrip}
        editingTrip={editingTrip}
        onUpdate={updateTrip}
      />

      <hr />

      <TripList
        trips={trips}
        onDelete={deleteTrip}
        onEdit={setEditingTrip}
      />
    </div>
  );
}