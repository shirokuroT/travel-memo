import { useEffect, useState } from "react";
import type { Trip } from "../types/Trip";
import type { SaveStatus } from "../hooks/useTrips";
import { TiptapEditor } from "./TiptapEditor";

type Props = {
  trip: Trip;
  onUpdate: (trip: Trip) => void;
  saveStatus: SaveStatus;
  onSaveNow: () => Promise<void>;
};

const SAVE_STATUS_LABEL: Record<
  SaveStatus,
  { text: string; color: string }
> = {
  saved: { text: "保存済み ✅", color: "#16a34a" },
  pending: { text: "編集中...", color: "#d97706" },
  saving: { text: "保存中...", color: "#2563eb" },
  error: {
    text: "保存に失敗しました。「保存」を押して再試行してください",
    color: "#dc2626",
  },
};

export const TripDetail = ({
  trip,
  onUpdate,
  saveStatus,
  onSaveNow,
}: Props) => {
  const [selectedPageId, setSelectedPageId] =
    useState("");

  const [isLinkFormOpen, setIsLinkFormOpen] =
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

const [linkName, setLinkName] =
  useState("");

const [linkUrl, setLinkUrl] =
  useState("");

const [linkType, setLinkType] =
  useState<"place" | "route" | "website">(
    "place"
  );

const [openedSpot, setOpenedSpot] =
  useState<string | null>(null);

  const [editingLinkId, setEditingLinkId] =
  useState<string | null>(null);

  const currentPage =
    trip.pages.find(
      (page) => page.id === selectedPageId
    ) ?? trip.pages[0];


const links = currentPage.links ?? [];

const groupedLinks = links.reduce(
  (acc, link) => {
    if (!acc[link.name]) {
      acc[link.name] = [];
    }

    acc[link.name].push(link);

    return acc;
  },
  {} as Record<string, typeof links>
);

const deleteLink = (linkId: string) => {
  const updatedTrip: Trip = {
    ...trip,
    pages: trip.pages.map((page) =>
      page.id === currentPage.id
        ? {
            ...page,
            links: page.links.filter(
              (link) => link.id !== linkId
            ),
          }
        : page
    ),
  };

  onUpdate(updatedTrip);
};

const startEditLink = (
  link: {
    id: string;
    name: string;
    type: "place" | "route" | "website";
    url: string;
  }
) => {
  setEditingLinkId(link.id);

  setLinkName(link.name);

  setLinkType(link.type);

  setLinkUrl(link.url);
};

const addLink = () => {
  if (!linkName || !linkUrl) {
    return;
  }

  const newLink = {
  id: editingLinkId ?? crypto.randomUUID(),
  name: linkName,
  type: linkType,
  url: linkUrl,
};


  const updatedTrip: Trip = {
    ...trip,
    pages: trip.pages.map((page) =>
      page.id === currentPage.id
        ? {
            ...page,
            links: editingLinkId
  ? page.links.map((link) =>
      link.id === editingLinkId
        ? newLink
        : link
    )
  : [
      ...(page.links ?? []),
      newLink,
    ],
          }
        : page
    ),
  };

  onUpdate(updatedTrip);

  setLinkName("");
  setLinkUrl("");
  setEditingLinkId(null);
};

  const updateMemo = (
    pageId: string,
    memo: string
  ) => {
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

  const statusLabel = SAVE_STATUS_LABEL[saveStatus];


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

      <TiptapEditor
  content={currentPage?.memo ?? ""}
  onChange={(content) =>
    updateMemo(
      currentPage.id,
      content
    )
  }
/>

  <div
  style={{
    marginTop: "24px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  }}
>
  <h3
    onClick={() =>
      setIsLinkFormOpen(
        !isLinkFormOpen
      )
    }
    style={{
      cursor: "pointer",
      padding: "16px",
      margin: 0,
    }}
  >
    {isLinkFormOpen
      ? "▼ "
      : "▶ "}
    リンク追加
  </h3>
{isLinkFormOpen && (
  <>
  <input
    type="text"
    placeholder="名称"
    value={linkName}
    onChange={(e) =>
      setLinkName(e.target.value)
    }
  />

  <br />
  <br />

  <select
    value={linkType}
    onChange={(e) =>
      setLinkType(
        e.target.value as
          | "place"
          | "route"
          | "website"
      )
    }
  >
    <option value="place">
      場所
    </option>

    <option value="route">
      経路
    </option>

    <option value="website">
      HP等
    </option>
  </select>

  <br />
  <br />

  <input
    type="text"
    placeholder="URL"
    value={linkUrl}
    onChange={(e) =>
      setLinkUrl(e.target.value)
    }
  />

  <br />
  <br />

  <button onClick={addLink}>
  追加
</button>
</>
)}
</div>

<div
  style={{
    marginTop: "20px",
  }}
>
  <h3>保存済みリンク</h3>

  {Object.entries(groupedLinks).map(
    ([name, spotLinks]) => (
      <div
        key={name}
        style={{
          marginBottom: "16px",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h4
  onClick={() =>
    setOpenedSpot(
      openedSpot === name
        ? null
        : name
    )
  }
  style={{
    cursor: "pointer",
  }}
>
  {openedSpot === name
    ? "▼ "
    : "▶ "}
  {name}
</h4>

        {openedSpot === name &&
  spotLinks.map((link) => (
          <div
            key={link.id}
            style={{
              marginBottom: "8px",
            }}
          >
           <a
  href={link.url}
  target="_blank"
  rel="noreferrer"
  style={{
    display: "inline-block",
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    textDecoration: "none",
  }}
>
  {link.type === "place" &&
    "📍 場所を開く"}

  {link.type === "route" &&
    "🚗 経路を開く"}

  {link.type === "website" &&
    "🌐 HPを開く"}
</a>

       <button
  onClick={() =>
    startEditLink(link)
  }
  style={{
    marginLeft: "8px",
  }}
>
  ✏️
</button>     
  <button
    onClick={() =>
      deleteLink(link.id)
    }
    style={{
      marginLeft: "8px",
    }}
  >
    🗑️
  </button>
 
</div>
          
        ))}
      </div>
    )
  )}
</div>

      <p
        style={{
          color: statusLabel.color,
          fontWeight: "bold",
        }}
      >
        {statusLabel.text}
      </p>

      <div
        style={{
          marginTop: "12px",
        }}
      >
        <button
          onClick={() => void onSaveNow()}
          disabled={saveStatus === "saved"}
        >
          保存
        </button>
      </div>
    </div>
  );
};