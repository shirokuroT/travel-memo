import { useEffect, useRef, useState } from "react";
import type { Trip } from "../types/Trip";
import {
  countDays,
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

  const [error, setError] = useState("");

  const formRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // 「編集」を押したらフォームまでスクロールし、旅行名にカーソルを置く
  useEffect(() => {
    if (!editingTrip) return;

    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    titleInputRef.current?.focus({ preventScroll: true });
  }, [editingTrip]);

  const validate = () => {
    if (!title.trim()) return "旅行名を入力してください";
    if (!startDate || !endDate)
      return "開始日と終了日を入力してください";
    if (countDays(startDate, endDate) === null)
      return "終了日は開始日と同じか、それより後の日付にしてください";
    return "";
  };

  const handleSubmit = () => {
    const message = validate();
    setError(message);
    if (message) return;

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
    <div className="form-container" ref={formRef}>
      <h2>
        {editingTrip
          ? "旅行を編集"
          : "新しい旅行"}
      </h2>

      <input
        ref={titleInputRef}
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
        min={startDate || undefined}
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

      {error && (
        <p
          role="alert"
          style={{ color: "#dc2626", margin: "8px 0 0" }}
        >
          {error}
        </p>
      )}
    </div>
  );
};
