import TripCard from "../components/TripCard";
import TripForm from "../components/TripForm";
import { Plus, Map, X, SlidersHorizontal } from "lucide-react";
import { useState, useContext } from "react";
import { TripsContext } from "../context/TripsContext";

export default function TripsList() {
  const { trips, addTrip, updateTrip } = useContext(TripsContext);
  const [open, setOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    planned: false,
    ongoing: false,
    completed: false,
  });

  const anyFilterActive = Object.values(filters).some((v) => v);
  const filteredTrips = anyFilterActive
    ? trips.filter((trip) => filters[trip.tripStatus])
    : trips;

  const handleSaveEdit = (updatedTrip) => {
    updateTrip(updatedTrip);
    setEditingTrip(null);
    setOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const openModal = (trip) => {
    setEditingTrip(trip);
    setOpen(true);
  };

  const closeModal = () => {
    setEditingTrip(null);
    setOpen(false);
  };

  return (
    <section className="trip-list p-4 sm:p-8">
      {/* HEADER */}
      <header className="flex items-center gap-3 py-4 border-b border-gray-200">
        <Map size={32} className="text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">TripTailor</h1>
          <p className="text-gray-500 text-sm">Your personal travel planner</p>
        </div>
      </header>

      {/* CTA */}
      <div className="page-header py-8">
        <h2 className="text-4xl font-extrabold mb-2">Your Journeys</h2>
        <p className="text-lg text-gray-600 mb-6">
          Plan, organize, and track all your adventures in one place
        </p>
        <button
          onClick={() => openModal(null)}
          className="col-span-full mt-4 bg-gradient-to-r from-purple-700 to-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:opacity-90 active:scale-95 transition duration-150 flex items-center justify-center gap-2 font-semibold"
        >
          <Plus size={20} /> Plan New Trip
        </button>
      </div>

      {/* FILTERS */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full shadow-sm sm:hidden"
          onClick={() => setShowMobileFilters((prev) => !prev)}
        >
          <SlidersHorizontal size={20} />
          <span>Filters</span>
        </button>

        <div
          className={`flex flex-wrap gap-2 transition-all duration-300
            ${showMobileFilters ? "max-h-40 overflow-y-auto" : "max-h-0 overflow-hidden"}
            sm:max-h-full sm:overflow-visible sm:flex`}
        >
          {["planned", "ongoing", "completed"].map((status) => {
            const active = filters[status];
            const colors = {
              planned: "bg-blue-100 text-blue-800",
              ongoing: "bg-yellow-100 text-yellow-800",
              completed: "bg-green-100 text-green-800",
            };
            return (
              <button
                key={status}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, [status]: !prev[status] }))
                }
                className={`px-4 py-2 rounded-full font-medium text-sm flex items-center gap-1 transition
                  ${active ? colors[status] : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* TRIP GRID */}
      <div className="trip-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {filteredTrips.map((trip) => (
          <div key={trip.id} className="h-full flex">
            <TripCard trip={trip} onEdit={(trip) => openModal(trip)} className="flex-1" />
          </div>
        ))}
      </div>

      {/* TOAST */}
      {showToast && (
        <div className="fixed top-[3em] right-[3em] z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded shadow-lg transition-opacity duration-500">
            Trip saved!
          </div>
        </div>
      )}

      {/* MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl p-4 sm:p-6 my-auto animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold">
                {editingTrip ? "Edit Trip" : "Add your new trip"}
              </h3>
              <button
                onClick={closeModal}
                className="rounded-md p-2 hover:bg-gray-100 active:scale-95 transition"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto pt-3 pb-2">
              <TripForm
                isEditing={!!editingTrip}
                tripToEdit={editingTrip}
                onAddTrip={(newTrip) => {
                  addTrip(newTrip);
                  closeModal();
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 2000);
                }}
                onSaveEdit={handleSaveEdit}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
