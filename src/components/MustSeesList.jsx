import { useParams } from "react-router-dom";
import tripsData from "../data/mockTrips.jsx";
import ListItem from "./ListItem.jsx";
import { useContext } from "react";
import { TripsContext } from "../context/TripsContext";

export default function MustSeesList() {
  const { id } = useParams();

  // Get all necessary functions and data from context
  const { trips, toggleMustSee } = useContext(TripsContext);
  const ctxTrip = trips.find((t) => t.id === id);
  const fallbackTrip = tripsData.find((t) => t.id === id);
  const trip = ctxTrip || fallbackTrip;

  const mustSeeIds = trip?.mustSeeIds ?? [];

  // Filter must-sees
  const mustSeeAttractions = trip
    ? trip.attractions.filter((attraction) =>
        mustSeeIds.includes(attraction.id)
      )
    : [];
  const mustSeeRestaurants = trip
    ? trip.restaurants.filter((restaurant) =>
        mustSeeIds.includes(restaurant.id)
      )
    : [];
  const totalMustSees = mustSeeAttractions.length + mustSeeRestaurants.length;

  if (!trip) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading trip data or trip ID not found in URL.
      </div>
    );
  }

  // Handle Toggle Favorite
  const handleToggleFavorite = (itemId) => {
    // Toggling the must-see status means removing it from this list.
    toggleMustSee(trip.id, itemId);
  };

  // NOTE: Edit and Delete handlers are no longer needed here
  // because we won't pass the onEdit or onDelete props to ListItem.

  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow-lg mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Your Must-Sees</h2>
      </div>

      {totalMustSees === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-500 italic">
          <p className="text-lg">No Must-See has been added yet.</p>
          <p className="text-sm mt-1">
            Mark your favorites on the Attractions and Restaurants pages!
          </p>
        </div>
      )}

      {mustSeeAttractions.length > 0 && (
        <section className="mt-8 pt-4 border-t border-gray-100">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex justify-between items-baseline">
            Attractions
          </h3>

          <div className="space-y-4">
            {mustSeeAttractions.map((item) => (
              <article
                key={item.id}
                className="cursor-pointer text-left overflow-hidden rounded-xl shadow-md transition-transform duration-300 ease-out
            hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-white"
              >
                <ListItem
                  item={item}
                  type="attraction"
                  isMustSee={true}
                  // ONLY passing onToggleFavorite
                  onToggleFavorite={() => handleToggleFavorite(item.id)}
                  // NOTE: onEdit and onDelete are OMITTED here
                />
              </article>
            ))}
          </div>
        </section>
      )}

      {mustSeeRestaurants.length > 0 && (
        <section className="mt-8 pt-4 border-t border-gray-100">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex justify-between items-baseline">
            Restaurants
          </h3>

          <div className="space-y-4">
            {mustSeeRestaurants.map((item) => (
              <article
                key={item.id}
                className="cursor-pointer text-left overflow-hidden rounded-xl shadow-md transition-transform duration-300 ease-out
            hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-white"
              >
                <ListItem
                  item={item}
                  type="restaurant"
                  isMustSee={true}
                  // ONLY passing onToggleFavorite
                  onToggleFavorite={() => handleToggleFavorite(item.id)}
                  // NOTE: onEdit and onDelete are OMITTED here
                />
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
