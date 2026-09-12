import { useEffect, useState } from "react";
import type { Trip } from "../types/Trip";

type Props = {
  trip: Trip;
  onUpdate: (trip: Trip) => void;
};

export const TripDetail = ({
  trip,
  onUpdate,
}: Props) => {
  const [selectedPageId, setSelectedPageId] =
    useState("");

  const [savedMessage, setSavedMessage] =
    useState("");

  const [isDirty, setIsDirty] =
    useState(false);


  useEffect(() => {
  if (
    !selectedPageId &&
    trip.pages.length > 0
  ) {
    setSelectedPageId(
      trip.pages[0].id
    );
  }
}, [selectedPageId, trip.pages]);

  const currentPage =
    trip.pages.find(
      (page) => page.id === selectedPageId
    ) ?? trip.pages[0];

  const updateMemo = (
    pageId: string,
    memo: string
  ) => {
    setIsDirty(true);
    
    const updatedTrip: Trip = {
      ...trip,
      pages: trip.pages.map((page) =>
        page.id === pageId
          ? { ...page, memo }
          : page
      ),
    };

    onUpdate(updatedTrip);
  };

  const handleSave = () => {
    
    setIsDirty(false);

    setSavedMessage("保存しました ✅");

    setTimeout(() => {
      setSavedMessage("");
    }, 2000);
  };

  return (
    <div>
      <h2>{trip.title}</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        {trip.pages.map((page) => (
          <button
            key={page.id}
            onClick={() =>
            setSelectedPageId(page.id)
        }
        style={{
            backgroundColor:
            selectedPageId === page.id
                ? "#2563eb"
                : "#ffffff",

        color:
            selectedPageId === page.id
                ? "white"
                : "black",

        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "8px 12px",
        cursor: "pointer",
    }}
>
  {page.title}
</button>
        ))}
      </div>

      <textarea
        style={{
          width: "100%",
          minHeight: "300px",
          resize: "vertical",
        }}
        value={currentPage?.memo ?? ""}
        onChange={(e) =>
          updateMemo(
            currentPage.id,
            e.target.value
          )
        }
      />

      <p
  style={{
    color: isDirty
      ? "#dc2626"
      : "#16a34a",
    fontWeight: "bold",
  }}
>
  {isDirty
    ? "編集中..."
    : "保存済み ✅"}
</p>

      <div
        style={{
          marginTop: "12px",
        }}
      >
        <button
          onClick={handleSave}
        >
          保存
        </button>
      </div>

      {savedMessage && (
        <p
          style={{
            color: "green",
            fontWeight: "bold",
          }}
        >
          {savedMessage}
        </p>
      )}
    </div>
  );
};