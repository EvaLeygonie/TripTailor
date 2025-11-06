import { Plus } from 'lucide-react'
import { useParams } from 'react-router-dom'
import trips from '../data/mockTrips.jsx'
import ListItem from './ListItem.jsx'

const AttractionsList = () => {
  const { id } = useParams()
  const trip = trips.find((t) => t.id === id)
  const mustSeeIds = trip ? trip.mustSeeIds : []

  if (!trip) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm sm:text-base">
        Loading trip data or trip ID not found in URL.
      </div>
    )
  }

  const handleAddClick = () => {
    console.log("Add function.")
  }

  return (
    <div className="p-3 sm:p-6 bg-white rounded-xl shadow-md sm:shadow-lg mt-4 sm:mt-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
          Attractions
        </h2>

        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 
                     bg-blue-600 text-white text-sm sm:text-base font-medium 
                     rounded-lg shadow hover:bg-blue-700 transition-all duration-150 active:scale-[0.97]"
        >
          <Plus size={18} className="sm:size-20" />
          <span>Add</span>
        </button>
      </div>

      {/* List of Attractions */}
      <div className="space-y-3 sm:space-y-4">
        {trip.attractions.map((attraction) => (
          <article
            key={attraction.id}
            className="cursor-pointer overflow-hidden rounded-lg sm:rounded-xl 
                       shadow-sm sm:shadow-md bg-gray-50 
                       hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                       transition-transform duration-300 ease-out"
          >
            <ListItem
              key={attraction.id}
              item={attraction}
              type="attraction"
              isMustSee={mustSeeIds.includes(attraction.id)}
              onToggleFavorite={() => console.log('Toggle not yet implemented.')}
            />
          </article>
        ))}
      </div>

      {/* Empty state */}
      {trip.attractions.length === 0 && (
        <div className="text-center py-8 text-gray-500 italic text-sm sm:text-base">
          No attractions have been added for this trip yet.
        </div>
      )}
    </div>
  )
}

export default AttractionsList
