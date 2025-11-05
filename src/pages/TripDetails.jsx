import { useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MapPin, ArrowLeft } from "lucide-react"
import TabNav from "../components/TabNav"
import MustSeesList from "../components/MustSeesList"
import AttractionsList from "../components/AttractionsList"
import RestaurantsList from "../components/RestaurantsList"
import PackingList from "../components/PackingList"
import BudgetView from "../components/BudgetView"
import trips from "../data/mockTrips"
import { TripsContext } from "../context/TripsContext"

export default function TripDetails() {
  const [activeTab, setActiveTab] = useState("mustsees")
  const navigate = useNavigate()
  const { id } = useParams()

  const { trips: contextTrips, removeTrip } = useContext(TripsContext)
  const allTrips = [...trips, ...contextTrips]
  const trip = allTrips.find((t) => t.id === id)

  if (!trip) {
    // Handle case where trip ID is invalid or not found
    return (
      <div className="p-8 text-center text-red-600">
        <h1 className="text-3xl font-bold">404</h1>
        <p>Trip not found! Please check the URL.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:underline">Go to Home</button>
      </div>
    );
  }

  return (
    <div className="trip-details flex flex-col h-full">

      {/* 2. DYNAMIC HEADER SECTION (Trip Name & Back Button) */}
      <header className="header flex items-center gap-3 p-4 border-b border-gray-200">
        <div className="flex items-left gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-semibold">{trip.title}</h2>
            <p className="text-gray-600 flex items-center gap-1 text-sm">
              <MapPin size={16} className="inline-block mr-1" />
              {trip.destination.city}, {trip.destination.country}
            </p>
          </div>
        </div>
      </header>

      {/* 3. TAB NAVIGATION */}
      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 4. TAB CONTENT AREA */}
      <div className="tab-content p-4 sm:p-6 flex-grow overflow-y-auto">
        {/* Conditional Rendering based on activeTab state */}
        {activeTab === "mustsees" && <MustSeesList trip={trip} />}
        {activeTab === "attractions" && <AttractionsList trip={trip} />}
        {activeTab === "restaurants" && <RestaurantsList trip={trip} />}
        {activeTab === "packing" && <PackingList trip={trip} />}
        {activeTab === "budget" && <BudgetView trip={trip} />}
      </div>

      <button //Knapp behöver styling
        onClick={() => {
          removeTrip(trip.id)
          navigate("/")
        }}
        className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-150 flex items-center gap-2"
      >Remove Trip</button>
    </div>
  )
}
