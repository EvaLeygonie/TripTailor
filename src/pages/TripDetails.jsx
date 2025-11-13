import { useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MapPin, ArrowLeft, Map } from "lucide-react"
import TabNav from "../components/TabNav"
import MustSeesList from "../components/MustSeesList"
import AttractionsList from "../components/AttractionsList"
import RestaurantsList from "../components/RestaurantsList"
import PackingList from "../components/PackingList"
import BudgetView from "../components/BudgetView"
import CalendarView from "../components/CalendarView"
import trips from "../data/mockTrips"
import { TripsContext } from "../context/TripsContext"
import { Link } from "react-router-dom";

export default function TripDetails() {
  const [activeTab, setActiveTab] = useState("mustsees")
  const navigate = useNavigate()
  const { id } = useParams()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showRemoveButton, setShowRemoveButton] = useState(true)

  const { trips: contextTrips, removeTrip } = useContext(TripsContext)
  const allTrips = [...trips, ...contextTrips]
  const trip = allTrips.find((t) => t.id === id)

  const handleRemoveClick = () => {
    setShowConfirmation(true)
    setShowRemoveButton(false)
  }

  const handleConfirm = () => {
    removeTrip(id)
    setShowConfirmation(false)
    navigate("/")
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setShowRemoveButton(true)
  }

  if (!trip) {
    return (
      <div className="p-8 text-center text-red-600 min-h-screen">
        <h1 className="text-3xl font-bold">404</h1>
        <p>Trip not found! Please check the URL.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    )
  }

  return (
    <section className="trip-details p-4 sm:p-8 py-6 min-h-screen flex flex-col max-w-5xl mx-auto w-full">

      <header className="flex items-center gap-3 py-4 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <Map size={32} className="text-purple-700 flex-shrink-0" />
          <div className="text-gray-900">
            <h1 className="text-2xl font-bold">TripTailor</h1>
            <p className="text-gray-500 text-sm">Your personal travel planner</p>
          </div>
        </Link>
      </header>

      {/* HEADER (Back + Destination info) */}
      {/* HEADER */}
      <header className="flex items-center gap-3 py-4 border-b border-gray-200 bg-white sticky top-0 z-30">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{trip.title}</h2>
          <p className="text-gray-600 flex items-center gap-1 text-sm sm:text-base">
            <MapPin size={16} />
            {trip.destination.city}, {trip.destination.country}
          </p>
        </div>
      </header>


      {/* TABS */}
      <div className="mt-4 sticky top-[70px] z-10 pb-2 border-b border-gray-200  bg-white">
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>


      {/* TAB CONTENT */}
      <div className="tab-content mt-6 flex-grow p-4 sm:p-6 bg-white rounded-2xl shadow-sm overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto">
        {activeTab === "mustsees" && <MustSeesList trip={trip} />}
        {activeTab === "attractions" && <AttractionsList trip={trip} />}
        {activeTab === "restaurants" && <RestaurantsList trip={trip} />}
        {activeTab === "packing" && <PackingList trip={trip} />}
        {activeTab === "budget" && <BudgetView trip={trip} />}
        {activeTab === "planning" && <CalendarView trip={trip} />}
      </div>
    </div>

      {/* REMOVE TRIP SECTION */}
      <div className="mt-8 text-center">
        {showRemoveButton && (
          <button
            onClick={handleRemoveClick}
            className="bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-150 inline-flex items-center gap-2"
          >
            Remove Trip
          </button>
        )}

        {showConfirmation && (
          <div className="mt-4 p-6 bg-gray-100 rounded-lg shadow-inner inline-block">
            <p className="mb-4 text-gray-800 font-medium">
              Are you sure you want to delete this trip?
            </p>
            <div className="flex gap-3 items-center justify-center">
              {/* Confirm (Yes) */}
              <button
                className="bg-gradient-to-b from-red-500 to-red-700 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:from-red-600 hover:to-red-800 transition-all duration-200"
                onClick={handleConfirm}
              >
                Yes
              </button>

              {/* Cancel (No) */}
              <button
                className="bg-gradient-to-b from-violet-500 to-violet-700 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:from-violet-600 hover:to-violet-800 transition-all duration-200"
                onClick={handleCancel}
              >
                No
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
