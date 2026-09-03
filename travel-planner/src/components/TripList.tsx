import { Link } from "react-router-dom";
import type { Trip } from "../types/Trip";

type Props = {
  trips: Trip[];
  onDelete: (id: string) => void;
  onEdit: (trip: Trip) => void;
};

export const TripList = ({
  trips,
  onDelete,
  onEdit,
}: Props) => {
  if (trips.length === 0) {
    return <p>旅行がまだありません。</p>;
  }

  return (
    <div>
      {trips.map((trip) => (
        <div
          key={trip.id}
          className="trip-card"
        >
          <h3>
            <Link
              to={`/trip/${trip.id}`}
            >
              {trip.title}
            </Link>
          </h3>

          <p>
            {trip.startDate}
            {" ～ "}
            {trip.endDate}
          </p>

          <p>
            {trip.pages.length}
            件のページ
          </p>

          <button
            onClick={() => onEdit(trip)}
          >
            編集
          </button>

          <button
            onClick={() => {
              if (
                  window.confirm(
                    "この旅行を削除しますか？"
                  )
              ) {
                  onDelete(trip.id);
                }
            }}
          >
            削除
          </button>
        </div>
      ))}
    </div>
  );
};