import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MapPin, ArrowLeft } from "lucide-react"
import TabNav from "../components/TabNav"
import MustSeesList from "../components/MustSeesList"
import AttractionsList from "../components/AttractionsList"
import RestaurantsList from "../components/RestaurantsList"
import PackingList from "../components/PackingList"
import BudgetView from "../components/BudgetView"
import trips from "../data/mockTrips"

export default function TripDetails() {
  const [activeTab, setActiveTab] = useState("mustsees")
  const navigate = useNavigate()
  const { id } = useParams()
  const trip = trips.find((t) => t.id === id)

  if (!trip) {
    return <div>Trip not found!</div>
  }

  // 💡 (FUTURE STEP: Update the Header prop in App.jsx or use Context)

  return (
    <div className="trip-details">
      <header className="flex items-left gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <span>
          <h2 className="text-xl font-semibold">{trip?.title}</h2>
          <p className="text-gray-600 flex items-center gap-1">
            <MapPin size={16} />
            {trip?.destination?.city}, {trip?.destination?.country}
          </p>
        </span>
      </header>
      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tab-content">
        {activeTab === "mustsees" && <MustSeesList />}
        {activeTab === "attractions" && <AttractionsList />}
        {activeTab === "restaurants" && <RestaurantsList />}
        {activeTab === "packing" && <PackingList />}
        {activeTab === "budget" && <BudgetView />}
      </div>
    </div>
  )
}
