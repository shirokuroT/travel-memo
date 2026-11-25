import { useState } from "react";
import type { Trip } from "../types/Trip";
import {
  getRemovedPages,
  hasPageContent,
  resizePages,
} from "../lib/tripPages";

type Props = {
  onAdd: (
    title: string,
    startDate: string,
    endDate: string
  ) => void;

  editingTrip: Trip | null;

  onUpdate: (trip: Trip) => void;

  onCancel: () => void;
};

export const TripForm = ({
  onAdd,
  editingTrip,
  onUpdate,
  onCancel,
}: Props) => {
  // 編集対象が変わると Home の key でフォームが作り直され、ここで初期値が入る
  const [title, setTitle] = useState(
    editingTrip?.title ?? ""
  );
  const [startDate, setStartDate] = useState(
    editingTrip?.startDate ?? ""
  );
  const [endDate, setEndDate] = useState(
    editingTrip?.endDate ?? ""
  );

  const handleSubmit = () => {
    if (!title.trim()) return;

    if (editingTrip) {
      const removedWithContent = getRemovedPages(
        editingTrip.pages,
        startDate,
        endDate
      ).filter(hasPageContent);

      if (
        removedWithContent.length > 0 &&
        !window.confirm(
          `日数が減るため、${removedWithContent
            .map((page) => page.title)
            .join("、")}のメモとリンクが削除されます。よろしいですか？`
        )
      ) {
        return;
      }

      onUpdate({
        ...editingTrip,
        title,
        startDate,
        endDate,
        pages: resizePages(
          editingTrip.pages,
          startDate,
          endDate
        ),
      });
    } else {
      onAdd(title, startDate, endDate);

      setTitle("");
      setStartDate("");
      setEndDate("");
    }
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

      {editingTrip && (
        <button onClick={onCancel}>
          キャンセル
        </button>
      )}
    </div>
  );
};
