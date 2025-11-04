import { Link } from "react-router-dom"
import trips from "../data/mockTrips"
import TripCard from "../components/TripCard"
import { Plus, Map } from "lucide-react"

export default function TripsList() {
  return (
    <section className="trip-list p-4 sm:p-8">

      {/* 1. APP LOGO/BRANDING SECTION */}
      <header className="app-branding flex items-center gap-3 py-4 border-b border-gray-200">
        <Map size={32} className="text-blue-600" /> {/* Placeholder Icon */}
        <div>
          <h1 className="text-2xl font-bold">TripTailor</h1>
          <p className="text-gray-500 text-sm">Your personal travel planner</p>
        </div>
      </header>

      {/* 2. PAGE HEADER / CALL-TO-ACTION SECTION */}
      <div className="page-header py-8">
        <h2 className="text-4xl font-extrabold mb-2">Your Journeys</h2>
        <p className="text-lg text-gray-600 mb-6">
          Plan, organize, and track all your adventures in one place
        </p>

        {/* The "Plan New Trip" Button (CTA) */}
        <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-150 flex items-center gap-2">
          <Plus size={20} />
          Plan New Trip
        </button>
      </div>

      {/* 3. TRIP GRID CONTENT (Your existing logic) */}
      <div className="trip-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {trips.map((trip) => (
          <Link key={trip.id} to={`/trip/${trip.id}`} className="trip-card">
            <TripCard trip={trip} />
          </Link>
        ))}
      </div>
    </section>
  )
}
