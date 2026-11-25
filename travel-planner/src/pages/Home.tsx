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

  const handleUpdate = (trip: Trip) => {
    updateTrip(trip);
    setEditingTrip(null);
  };

  const handleDelete = (id: string) => {
    if (editingTrip?.id === id) {
      setEditingTrip(null);
    }
    deleteTrip(id);
  };

  return (
    <div className="container">
      <h1>✈️ Travel Memo</h1>

      <TripForm
        key={editingTrip?.id ?? "new"}
        onAdd={addTrip}
        editingTrip={editingTrip}
        onUpdate={handleUpdate}
        onCancel={() => setEditingTrip(null)}
      />

      <hr />

      <TripList
        trips={trips}
        onDelete={handleDelete}
        onEdit={setEditingTrip}
      />
    </div>
  );
}
