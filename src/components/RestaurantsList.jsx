import { Plus, X, MapPin, Clock, Star, Tag, Calendar, Utensils } from 'lucide-react'
import { useParams } from 'react-router-dom'
// Note: We use the relative paths provided in the user's input, assuming the developer will resolve them locally.
import { coverImages } from "../data/mockImages";
import ListItem from './ListItem'
import { useState, useContext } from 'react'
import { TripsContext } from '../context/TripsContext'
import tripsData from '../data/mockTrips'

// Helper functions (kept outside the component for clean access)
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

const RestaurantsList = () => {
  const { id } = useParams()

  // Simplified context usage. Assuming context now provides restaurant-specific handlers.
  const {
    trips,
    addRestaurant, // Changed from addAttraction
    editRestaurant, // Changed from editAttraction
    removeRestaurant, // Changed from removeAttraction
    toggleMustSee
  } = useContext(TripsContext);

  // Use the context trip if available, otherwise fall back to mock data structure for safety
  const trip = trips.find((t) => t.id === id) || tripsData.find((t) => t.id === id);

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [priceLevel, setPriceLevel] = useState("");
  const [expectedCost, setExpectedCost] = useState("");
  const [durationMin, setDurationMin] = useState(""); // Used for dining time
  const [openingHours, setOpeningHours] = useState("");
  const [planning, setPlanning] = useState("");
  const [selectedImage, setSelectedImage] = useState(coverImages[0]?.url || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [expandedItemId, setExpandedItemId] = useState(null);

  // Use the mustSeeIds array from the trip context
  const mustSeeIds = trip ? trip.mustSeeIds : [];

  if (!trip) {
    return <div className="p-4 text-center text-gray-500">Loading trip data or trip ID not found.</div>
  }

  // Use the restaurant list from the trip object
  const restaurantList = trip.restaurants || [];


  const suggestedCategories = [
    "Fine Dining", "Casual Dining", "Cafe / Bakery", "Bar / Pub", "Street Food",
    "Italian", "Asian", "Mexican", "Local Cuisine", "Seafood", "Vegetarian / Vegan", "Dessert", "Other"
  ];

  const resetForm = () => {
    setName("");
    setCategory("");
    setAddress("");
    setDescription("");
    setRating("");
    setPriceLevel("");
    setExpectedCost("");
    setDurationMin("");
    setOpeningHours("");
    setPlanning("");
    setSelectedImage(coverImages[0]?.url || "");
    setEditingItemId(null);
    setIsEditing(false);
    setError("");
    setSaving(false);
  }

  const handleAddClick = () => {
    resetForm();
    setOpen(true);
  };

  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditingItemId(item.id);
    setName(item.title || "");
    setCategory(item.category || "");
    setAddress(item.address || "");
    setDescription(item.description || "");
    setRating(item.rating?.toString() || "");
    setPriceLevel(item.priceLevel || "");
    setExpectedCost(item.expectedCost?.toString() || "");
    setDurationMin(item.durationMin?.toString() || "");
    setOpeningHours(item.openingHours || "");
    setPlanning(item.planning || "");
    setSelectedImage(item.image || coverImages[0]?.url);
    setError("");
    setOpen(true);
  }

  const handleDeleteClick = (itemId) => {
      setItemToDeleteId(itemId);
      setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDeleteId) {
      removeRestaurant(trip.id, itemToDeleteId); // Changed to removeRestaurant
    }
    setItemToDeleteId(null);
    setShowConfirmation(false);
  }

  const handleCancelDelete = () => {
    setItemToDeleteId(null);
    setShowConfirmation(false);
  }

  const handleToggleExpand = (itemId) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };

  // NOTE: This function is passed down and handles state update via context
  const handlePlanItem = (itemId, date) => {
    editRestaurant(trip.id, itemId, { planning: date }); // Changed to editRestaurant
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a restaurant name."); // Updated error message
      return;
    }
    setSaving(true);

    const itemData = {
      title: name.trim(),
      category: category.trim() || "Casual Dining", // Updated default category
      address: address.trim() || "",
      description: description.trim() || "",
      rating: rating ? parseFloat(rating) : null,
      priceLevel: priceLevel || "",
      expectedCost: expectedCost ? parseFloat(expectedCost) : 0,
      durationMin: durationMin ? parseInt(durationMin) : 90, // Updated default duration to 90 min (dinner)
      openingHours: openingHours || "",
      planning: planning || "",
      image: selectedImage,
    };

    try {
      if (isEditing && editingItemId) {
        editRestaurant(trip.id, editingItemId, itemData); // Changed to editRestaurant
      } else {
        const newRestaurant = {
          ...itemData,
          id: `r_${Date.now()}`, // Using 'r_' prefix for restaurant IDs
        };
        addRestaurant(trip.id, newRestaurant); // Changed to addRestaurant
      }

      resetForm();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const restaurantToDelete = restaurantList.find(r => r.id === itemToDeleteId);

  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow-lg mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Restaurants</h2>

        <button
          onClick={handleAddClick}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-fuchsia-900 to-blue-800 text-white font-medium rounded-lg shadow-md hover:bg-violet-700 transition duration-150 ease-in-out"
        >
          <Plus size={20} />
          <span>Add</span>
        </button>
      </div>

      {/* List container: Constrained width and centered to match other lists */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {restaurantList.map(restaurant => { // Iterating over trip.restaurants
          const isExpanded = expandedItemId === restaurant.id;

          return (
            <ListItem
              key={restaurant.id}
              item={restaurant}
              type="restaurant" // Changed type to restaurant
              isMustSee={mustSeeIds.includes(restaurant.id)}
              onToggleFavorite={() => toggleMustSee(trip.id, restaurant.id)}
              isExpanded={isExpanded}
              onToggleExpand={() => handleToggleExpand(restaurant.id)}
              onEdit={() => handleEditClick(restaurant)}
              onDelete={() => handleDeleteClick(restaurant.id)}
              onPlan={handlePlanItem}
              tripStartDate={trip.dates.start}
              tripEndDate={trip.dates.end}
            >
              {/* --- Children: Expanded Details (Passed to ListItem) --- */}
              <div className="space-y-3">

                {/* Description - Adjusted to max-w-xl on large screens to reduce overall width */}
                <div className="text-sm text-gray-700 max-w-xl mx-auto text-left">
                    <p className="font-semibold mb-1 text-center">Description</p>
                    <p className="text-gray-600 italic leading-snug">{restaurant.description || "No detailed description provided for this restaurant."}</p>
                </div>

                {/* Detailed Stats Grid - Left-aligned */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 text-sm pt-2">

                    {/* Address */}
                    <div className="flex items-start">
                        <MapPin size={16} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className='flex flex-col text-left'>
                            <p className="font-medium text-gray-700">Location</p>
                            <p className="text-gray-500 leading-tight">{restaurant.address || "Address not available."}</p>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-start">
                        <Star size={16} className="text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                         <div className='flex flex-col text-left'>
                            <p className="font-medium text-gray-700">User Rating</p>
                            <p className="text-gray-500">{formatRating(restaurant.rating)}</p>
                        </div>
                    </div>

                    {/* Cost */}
                    <div className="flex items-start">
                        <Tag size={16} className="text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                         <div className='flex flex-col text-left'>
                            <p className="font-medium text-gray-700">Price</p>
                            <p className="text-gray-500">{restaurant.priceLevel} ({formatCost(restaurant.expectedCost)})</p>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-start">
                        <Clock size={16} className="text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                         <div className='flex flex-col text-left'>
                            <p className="font-medium text-gray-700">Dining Duration</p>
                            <p className="text-gray-500">{formatDuration(restaurant.durationMin)}</p>
                        </div>
                    </div>

                    {/* Opening Hours */}
                    <div className="flex items-start">
                        <Utensils size={16} className="text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                         <div className='flex flex-col text-left'>
                            <p className="font-medium text-gray-700">Opening Hours</p>
                            <p className="text-gray-500">{restaurant.openingHours || "Check locally"}</p>
                        </div>
                    </div>

                    {/* Planned Visit */}
                    <div className="flex items-start">
                        <Calendar size={16} className="text-violet-600 mr-2 flex-shrink-0 mt-0.5" />
                         <div className='flex flex-col text-left'>
                            <p className="font-medium text-gray-700">Planned Date</p>
                            <p className="text-gray-500 font-semibold">
                                {restaurant.planning ? restaurant.planning : "Not planned yet"}
                            </p>
                        </div>
                    </div>
                </div>
              </div>
            </ListItem>
          );
        })}
      </div>

      {restaurantList.length === 0 && (
        <div className="text-center py-8 text-gray-500 italic max-w-3xl mx-auto">
          No restaurants have been added for this trip yet.
        </div>
      )}

      {/* ===== Modal Add/Edit Restaurant ===== */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{isEditing ? "Edit Restaurant" : "Add Restaurant"}</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-3">

              {/* Name */}
              <label className="text-sm font-medium text-gray-700">Restaurant name</label>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. Italian Trattoria..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />

              {/* Category */}
              <label className="text-sm font-medium text-gray-700">Cuisine / Type</label>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. Fine Dining / Italian / Street Food..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="categoryOptions"
              />
              <datalist id="categoryOptions">
                {suggestedCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>

              {/* Address */}
              <label className="text-sm font-medium text-gray-700">Address</label>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. 123 Main Street, City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              {/* Description */}
              <label className="text-sm font-medium text-gray-700">Notes / Dishes to Try</label>
              <textarea
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[80px]"
                placeholder="Dishes to try, atmosphere notes, reservation details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Rating */}
              <label className="text-sm font-medium text-gray-700">Rating (1–5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. 4.8"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />

              {/* Price Level */}
              <label className="text-sm font-medium text-gray-700">Price level</label>
              <select
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={priceLevel}
                onChange={(e) => setPriceLevel(e.target.value)}
              >
                <option value="">Select price level</option>
                <option value="$">$ – Cheap</option>
                <option value="$$">$$ – Moderate</option>
                <option value="$$$">$$$ – Expensive</option>
                <option value="$$$$">$$$$ – Luxury</option>
              </select>

              {/* Expected cost */}
              <label className="text-sm font-medium text-gray-700">Expected cost (Kr per person)</label>
              <input
                type="number"
                min="0"
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. 350"
                value={expectedCost}
                onChange={(e) => setExpectedCost(e.target.value)}
              />

              {/* Duration */}
              <label className="text-sm font-medium text-gray-700">Typical dining duration (minutes)</label>
              <input
                type="number"
                min="0"
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. 90"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
              />

              {/* Opening hours */}
              <label className="text-sm font-medium text-gray-700">Opening hours</label>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. 18:00–23:00"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
              />

              {/* Planning (Modal version - uses trip constraints) */}
              <label className="text-sm font-medium text-gray-700">Planned visit (date)</label>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                type="date"
                min={trip.dates.start}
                max={trip.dates.end}
                value={planning}
                onChange={(e) => setPlanning(e.target.value)}
              />

              {/* Image selector from mockImages */}
              <label className="text-sm font-medium text-gray-700">Select image</label>
              <div className="grid grid-cols-3 gap-2">
                {coverImages.map((img) => (
                  <img
                    key={img.url}
                    src={img.url}
                    alt="cover option"
                    onClick={() => setSelectedImage(img.url)}
                    className={`h-20 w-full object-cover rounded-lg cursor-pointer border-2 ${
                      selectedImage === img.url
                        ? "border-red-500" // Changed highlight color
                        : "border-transparent hover:border-gray-300"
                    }`}
                  />
                ))}
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  onClick={() => setOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60" // Changed button color
                  disabled={saving || !name.trim()}
                >
                  {saving ? (isEditing ? "Saving..." : "Adding...") : (isEditing ? "Save Changes" : "Add")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Confirm Delete Modal ===== */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xs rounded-xl bg-white p-6 shadow-2xl text-center">
            <h3 className="text-lg font-bold text-red-600 mb-3">Confirm Deletion</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete **{restaurantToDelete?.title || 'this item'}**? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;
