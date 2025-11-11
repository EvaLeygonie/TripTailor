import { useParams } from "react-router-dom";
import tripsData from "../data/mockTrips.jsx";
import ListItem from "./ListItem.jsx";
import { useContext, useState } from "react";
import { TripsContext } from "../context/TripsContext";
import { MapPin, Clock, Star, Tag, Calendar, Utensils } from 'lucide-react'

// Helper functions (Duplicated from Attractions/RestaurantsList for self-containment)
const formatCost = (cost) => {
  if (cost === 0) return "Free";
  if (cost === undefined || cost === null) return "N/A";
  return `${cost} Kr`;
}

const formatRating = (rating) => {
  if (!rating) return "N/A";
  return `${rating} / 5.0`;
}

const formatDuration = (min) => {
    // Check if min is null or undefined
    if (min === null || min === undefined || min === '') return "N/A";

    // Ensure 'min' is treated as a number
    const totalMinutes = parseInt(min, 10);

    if (isNaN(totalMinutes) || totalMinutes <= 0) return "N/A";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
    if (hours > 0) return `${hours} hours`;
    if (minutes > 0) return `${minutes} minutes`;

    return "N/A";
}


export default function MustSeesList() {
  const { id } = useParams();

  // Get all necessary functions and data from context
  const { trips, toggleMustSee, editAttraction, editRestaurant } = useContext(TripsContext);
  const ctxTrip = trips.find((t) => t.id === id);
  const fallbackTrip = tripsData.find((t) => t.id === id);
  const trip = ctxTrip || fallbackTrip;

  const mustSeeIds = trip?.mustSeeIds ?? [];
  const tripStartDate = trip?.dates?.start;
  const tripEndDate = trip?.dates?.end;

  // State to handle the expansion of details
  const [expandedItemId, setExpandedItemId] = useState(null);

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

  // Handle Toggle Favorite (which removes it from this list)
  const handleToggleFavorite = (itemId) => {
    toggleMustSee(trip.id, itemId);
    // Collapse if the item was expanded
    if (expandedItemId === itemId) {
      setExpandedItemId(null);
    }
  };

  // Handle expanding/collapsing details
  const handleToggleExpand = (itemId) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };

  // Handle planning date update
  const handlePlanItem = (itemId, date, type) => {
      if (type === 'attraction') {
        editAttraction(trip.id, itemId, { planning: date });
      } else if (type === 'restaurant') {
        editRestaurant(trip.id, itemId, { planning: date });
      }
  };


  // --- Helper component to render the expanded details block ---
  const ExpandedDetails = ({ item, isRestaurant = false }) => (
    <div className="space-y-3">

        {/* Description */}
        <div className="text-sm text-gray-700 max-w-xl mx-auto text-left">
            <p className="font-semibold mb-1 text-center">Description</p>
            <p className="text-gray-600 italic leading-snug">{item.description || "No detailed description provided for this item."}</p>
        </div>

        {/* Detailed Stats Grid - Left-aligned */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 text-sm pt-2">

            {/* Address */}
            <div className="flex items-start">
                <MapPin size={16} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className='flex flex-col text-left'>
                    <p className="font-medium text-gray-700">Location</p>
                    <p className="text-gray-500 leading-tight">{item.address || "Address not available."}</p>
                </div>
            </div>

            {/* Rating */}
            <div className="flex items-start">
                <Star size={16} className="text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className='flex flex-col text-left'>
                    <p className="font-medium text-gray-700">User Rating</p>
                    <p className="text-gray-500">{formatRating(item.rating)}</p>
                </div>
            </div>

            {/* Cost */}
            <div className="flex items-start">
                <Tag size={16} className="text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className='flex flex-col text-left'>
                    <p className="font-medium text-gray-700">{isRestaurant ? 'Price' : 'Expected Cost'}</p>
                    <p className="text-gray-500">{item.priceLevel} ({formatCost(item.expectedCost)})</p>
                </div>
            </div>

            {/* Duration */}
            <div className="flex items-start">
                <Clock size={16} className="text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className='flex flex-col text-left'>
                    <p className="font-medium text-gray-700">{isRestaurant ? 'Dining Duration' : 'Duration'}</p>
                    <p className="text-gray-500">{formatDuration(item.durationMin)}</p>
                </div>
            </div>

            {/* Opening Hours */}
            <div className="flex items-start">
                {isRestaurant ?
                    <Utensils size={16} className="text-orange-500 mr-2 flex-shrink-0 mt-0.5" /> :
                    <Clock size={16} className="text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                }
                <div className='flex flex-col text-left'>
                    <p className="font-medium text-gray-700">Hours</p>
                    <p className="text-gray-500">{item.openingHours || "Check locally"}</p>
                </div>
            </div>

            {/* Planned Visit */}
            <div className="flex items-start">
                <Calendar size={16} className="text-violet-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className='flex flex-col text-left'>
                    <p className="font-medium text-gray-700">Planned Visit</p>
                    <p className="text-gray-500 font-semibold">
                        {item.planning ? item.planning : "Not planned yet"}
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
  // --- End of Helper component ---


  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow-lg mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Your Must-Sees</h2>
      </div>

      {totalMustSees === 0 && (
        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200 text-gray-500 italic max-w-3xl mx-auto">
          <p className="text-lg">No Must-See has been added yet.</p>
          <p className="text-sm mt-1">
            Mark your favorites on the Attractions and Restaurants pages!
          </p>
        </div>
      )}

      {mustSeeAttractions.length > 0 && (
        <section className="mt-8 pt-4 border-t border-gray-100 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex justify-between items-baseline">
            Attractions
          </h3>

          <div className="space-y-4">
            {mustSeeAttractions.map((item) => {
                const isExpanded = expandedItemId === item.id;

                return (
                  <ListItem
                    key={item.id}
                    item={item}
                    type="attraction"
                    isMustSee={true}
                    isExpanded={isExpanded} // Passed for expansion state
                    onToggleExpand={() => handleToggleExpand(item.id)} // Passed for expansion handler
                    onToggleFavorite={() => handleToggleFavorite(item.id)}
                    onPlan={(itemId, date) => handlePlanItem(itemId, date, 'attraction')} // Passed for planning
                    tripStartDate={tripStartDate}
                    tripEndDate={tripEndDate}
                    // onEdit and onDelete are correctly OMITTED
                  >
                    <ExpandedDetails item={item} isRestaurant={false} />
                  </ListItem>
                );
            })}
          </div>
        </section>
      )}

      {mustSeeRestaurants.length > 0 && (
        <section className="mt-8 pt-4 border-t border-gray-100 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-red-700 mb-4 flex justify-between items-baseline">
            Restaurants
          </h3>

          <div className="space-y-4">
            {mustSeeRestaurants.map((item) => {
                const isExpanded = expandedItemId === item.id;

                return (
                  <ListItem
                    key={item.id}
                    item={item}
                    type="restaurant"
                    isMustSee={true}
                    isExpanded={isExpanded} // Passed for expansion state
                    onToggleExpand={() => handleToggleExpand(item.id)} // Passed for expansion handler
                    onToggleFavorite={() => handleToggleFavorite(item.id)}
                    onPlan={(itemId, date) => handlePlanItem(itemId, date, 'restaurant')} // Passed for planning
                    tripStartDate={tripStartDate}
                    tripEndDate={tripEndDate}
                    // onEdit and onDelete are correctly OMITTED
                  >
                    <ExpandedDetails item={item} isRestaurant={true} />
                  </ListItem>
                );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
