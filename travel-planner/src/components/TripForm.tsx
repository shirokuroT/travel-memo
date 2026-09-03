import { useEffect, useState } from "react";
import type { Trip } from "../types/Trip";

type Props = {
  onAdd: (
    title: string,
    startDate: string,
    endDate: string
  ) => void;

  editingTrip: Trip | null;

  onUpdate: (trip: Trip) => void;
};

export const TripForm = ({
  onAdd,
  editingTrip,
  onUpdate,
}: Props) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (editingTrip) {
      setTitle(editingTrip.title);
      setStartDate(editingTrip.startDate);
      setEndDate(editingTrip.endDate);
    }
  }, [editingTrip]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    if (editingTrip) {
      onUpdate({
        ...editingTrip,
        title,
        startDate,
        endDate,
      });
    } else {
      onAdd(
        title,
        startDate,
        endDate
      );
    }

    setTitle("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="form-container">
      <h2>
        {editingTrip
          ? "旅行を編集"
          : "新しい旅行"}
      </h2>

      <input
        type="text"
        placeholder="旅行名"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <input
        type="date"
        value={startDate}
        onChange={(e) =>
          setStartDate(e.target.value)
        }
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) =>
          setEndDate(e.target.value)
        }
      />

      <button onClick={handleSubmit}>
        {editingTrip
          ? "更新"
          : "保存"}
      </button>
    </div>
  );
};