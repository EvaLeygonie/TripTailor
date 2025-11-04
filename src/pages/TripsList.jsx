import { Link } from "react-router-dom"
import trips from "../data/mockTrips"
import TripCard from "../components/TripCard"

export default function TripsList() {
  return (
    <section className="trip-list">
      <h1>Your Journeys</h1>
      <div className="trip-grid">
        {trips.map((trip) => (
          <Link key={trip.id} to={`/trip/${trip.id}`} className="trip-card">
            <TripCard trip={trip} />
          </Link>
        ))}
      </div>
    </section>
  )
}
