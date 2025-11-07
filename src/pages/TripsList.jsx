import { Link } from "react-router-dom";
import TripCard from "../components/TripCard";
import { Plus, Map, X } from "lucide-react";
import { useState, useContext } from "react";
import TripForm from "../components/TripForm";
import { TripsContext } from "../context/TripsContext"


export default function TripsList() {
  const [open, setOpen] = useState(false);
  const { trips, addTrip } = useContext(TripsContext)
  const [showToast, setShowToast] = useState(false)
  const [filters, setFilters] = useState({
    planned: false,
    ongoing: false,
    completed: false,
  })

  const anyFilterActive = Object.values(filters).some(v => v)
  const filteredTrips = anyFilterActive
    ? trips.filter(trip => filters[trip.tripStatus])
    : trips

  return (
    <section className="trip-list p-4 sm:p-8">
      {/* 1. APP LOGO/BRANDING SECTION */}
      <header className="app-branding flex items-center gap-3 py-4 border-b border-gray-200">
        <Map size={32} className="text-violet-700" /> {/* Placeholder Icon */}
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

        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-b from-violet-500 to-violet-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-violet-600 hover:to-violet-800 transition-all duration-200 flex items-center gap-2"
        >
          <Plus size={20} />
          Plan New Trip
        </button>
      </div>


      <div className="mt-4 flex gap-4">
        <p>Filter trips: </p>
        {["planned", "ongoing", "completed"].map((status) => (
          <label key={status} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters[status]}
              onChange={() =>
                setFilters((prev) => ({ ...prev, [status]: !prev[status] }))
              }
            />
            <span className="capitalize">{status}</span>
          </label>
        ))}
      </div>

      {/* 3. TRIP GRID CONTENT (Your existing logic) */}
      <div className="trip-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {filteredTrips.map((trip) => (
          <Link key={trip.id} to={`/trip/${trip.id}`} className="trip-card">
            <TripCard trip={trip} />
          </Link>
        ))}
      </div>

      {showToast && (
        <div className="fixed top-[3em] right-[3em] z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded shadow-lg transition-opacity duration-500">
            The trip has been added!
          </div>
        </div>
      )}

      {/* 4. Modal contain TripForm */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Add your new trip</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <TripForm
              onAddTrip={(newTrip) => {
                addTrip(newTrip)
                setOpen(false)

                setShowToast(true)
                setTimeout(() => setShowToast(false), 2000)
              }} />
          </div>
        </div>
      )}
    </section>
  )
}
