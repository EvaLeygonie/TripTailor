import { Link } from "react-router-dom";
import trips from "../data/mockTrips";
import TripCard from "../components/TripCard";

export default function TripsList() {
  return (
    <section className="px-6 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Your Journeys
      </h1>

      {/* GRIDLAYOUT FÖR KORTEN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {trips.map((trip) => (
          <Link
            key={trip.id}
            to={`/trip/${trip.id}`}
            aria-label="´View details for ${trip.title}´"
            className="w-full max-w-sm transform transition hover:scale-[1.02]"
          >
            <TripCard trip={trip} />
          </Link>
        ))}
      </div>
    </section>
  );
}
