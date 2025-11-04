import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import trips from "../data/mockTrips"

export default function Header({ isTripPage }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const trip = trips.find((t) => t.id === id)

return (
    <header className="header flex items-center gap-3 p-4 border-b border-gray-200">
      {!isTripPage ? (
        <h1 className="text-2xl font-bold">TripTailor</h1>
      ) : (
        <div className="flex items-left gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-semibold">{trip?.title || "Trip"}</h2>
            <p className="text-gray-600">
              {trip?.destination?.city}, {trip?.destination?.country}
            </p>
          </div>
        </div>
      )}
    </header>
  )
}
