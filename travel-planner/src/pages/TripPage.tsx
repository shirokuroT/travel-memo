import { useParams } from "react-router-dom";

import { TripDetail } from "../components/TripDetail";
import { useTrips } from "../hooks/useTrips";
import { Link } from "react-router-dom";

export default function TripPage() {
  const { id } = useParams();

  const {
    trips,
    updateTrip,
  } = useTrips();

  const trip = trips.find(
    (trip) => trip.id === id
  );

  if (!trip) {
    return <p>旅行が見つかりません</p>;
  }

  return (
    <div className="container">
        <Link to="/">
  ← 一覧へ戻る
</Link>
      <TripDetail
        trip={trip}
        onUpdate={updateTrip}
      />
    </div>
  );
}