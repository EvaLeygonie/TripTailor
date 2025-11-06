
import { Plus } from 'lucide-react'
import { useParams } from 'react-router-dom'
import trips from '../data/mockTrips.jsx'
import ListItem from './ListItem.jsx'


const AttractionsList = () => {
  const { id } = useParams()
  const trip = trips.find((t) => t.id === id)
  const mustSeeIds = trip ? trip.mustSeeIds : [];

  if (!trip) {
    return <div className="p-4 text-center text-gray-500">Loading trip data or trip ID not found in URL.</div>
  }

  // Placeholder function (inert for now)
  const handleAddClick = () => {
    console.log("Add function.");
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow-lg mt-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Attractions</h2>
        <button
          onClick={handleAddClick} // Inert placeholder function
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-150 ease-in-out"
        >
          <Plus size={20} />
          <span>Add</span>
        </button>
      </div>

      <div className="space-y-4">
        {trip.attractions.map(attraction => (
          <article
            key={attraction.id}
            className="cursor-pointer overflow-hidden rounded-xl shadow-md transition-transform duration-300 ease-out 
            hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-gray-50"
          >
          <ListItem
            key={attraction.id}
            item={attraction}
            type="attraction"
            // Use mustSeeIds for initial 'favorite' state display
            isMustSee={mustSeeIds.includes(attraction.id)}
            // Inert placeholder function
            onToggleFavorite={() => console.log('Toggle not yet implemented.')}
          />
          </article>
        ))}
      </div>

      {trip.attractions.length === 0 && (
        <div className="text-center py-8 text-gray-500 italic ">
          No attractions have been added for this trip yet.
        </div>
      )}
    </div>
  );
};

export default AttractionsList;
