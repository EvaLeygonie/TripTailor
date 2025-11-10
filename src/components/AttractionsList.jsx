import { Plus, X, MapPin, Clock, Star, Tag, Calendar } from 'lucide-react'
import { useParams } from 'react-router-dom'
// Removed mockTrips and mockImages imports
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

const AttractionsList = () => {
  const { id } = useParams()

  // Simplified context usage
  const { trips, addAttraction, editAttraction, removeAttraction, toggleMustSee } = useContext(TripsContext);

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
  const [durationMin, setDurationMin] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [planning, setPlanning] = useState("");
  const [selectedImage, setSelectedImage] = useState(coverImages[0]?.url || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [expandedItemId, setExpandedItemId] = useState(null);

  const mustSeeIds = trip ? trip.mustSeeIds : [];

  if (!trip) {
    return <div className="p-4 text-center text-gray-500">Loading trip data or trip ID not found.</div>
  }

  const suggestedCategories = [
    "Nature", "Landmark", "Museum", "Sightseeing", "Entertainment",
    "Historical Site", "Art Gallery", "Park", "Beach", "Religious Site",
    "Theme Park", "Shopping", "Other"
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
      removeAttraction(trip.id, itemToDeleteId);
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

  const handlePlanItem = (itemId, date) => {
    editAttraction(trip.id, itemId, { planning: date });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter an attraction name.");
      return;
    }
    setSaving(true);

    const itemData = {
      title: name.trim(),
      category: category.trim() || "Sightseeing",
      address: address.trim() || "",
      description: description.trim() || "",
      rating: rating ? parseFloat(rating) : null,
      priceLevel: priceLevel || "",
      expectedCost: expectedCost ? parseFloat(expectedCost) : 0,
      durationMin: durationMin ? parseInt(durationMin) : 120,
      openingHours: openingHours || "",
      planning: planning || "",
      image: selectedImage,
    };

    try {
      if (isEditing && editingItemId) {
        editAttraction(trip.id, editingItemId, itemData);
      } else {
        const newAttraction = {
          ...itemData,
          id: `a_${Date.now()}`,
        };
        addAttraction(trip.id, newAttraction);
      }

      resetForm();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const attractionToDelete = trip.attractions.find(a => a.id === itemToDeleteId);

  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow-lg mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Attractions</h2>

        <button
          onClick={handleAddClick}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-150 ease-in-out"
        >
          <Plus size={20} />
          <span>Add</span>
        </button>
      </div>

      {/* List container: Constrained width and centered */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {trip.attractions.map(attraction => {
          const isExpanded = expandedItemId === attraction.id;

          return (
            <ListItem
              key={attraction.id}
              item={attraction}
              type="attraction"
              isMustSee={mustSeeIds.includes(attraction.id)}
              onToggleFavorite={() => toggleMustSee(trip.id, attraction.id)}
              isExpanded={isExpanded}
              onToggleExpand={() => handleToggleExpand(attraction.id)}
              onEdit={() => handleEditClick(attraction)}
              onDelete={() => handleDeleteClick(attraction.id)}
              onPlan={handlePlanItem}
              tripStartDate={trip.dates.start}
              tripEndDate={trip.dates.end}
            >
              {/* --- Children: Expanded Details (Passed to ListItem) --- */}
              <div className="space-y-3">

                {/* Description - NOW FULLY LEFT ALIGNED AND MAX WIDTH APPLIED TO CENTER TEXT BLOCK */}
                <div className="text-sm text-gray-700 max-w-2xl mx-auto text-left">
                    <p className="font-semibold mb-1 text-center">Description</p>
                    <p className="text-gray-600 italic leading-snug">{attraction.description || "No detailed description provided for this item."}</p>
                </div>

                {/* Detailed Stats Grid - NOW USING GRID-COLS-1 ON SMALL SCREENS AND EXPLICITLY LEFT-ALIGNED */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 text-sm pt-2">

                    {/* Address */}
                    <div className="flex items-start">
                        <MapPin size={16} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className='flex flex-col text-left'>
                            <p className="font-medium text-gray-700">Location</p>
                            <p className="text-gray-500 leading-tight">{attraction.address || "Address not available."}</p>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-start">
                        <Star size={16} className="text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                         <div className='flex flex-col text-left'>
                            <p className="font-medium text-gray-700">User Rating</p>
                            <p className="text-gray-500">{formatRating(attraction.rating)}</p>
                        </div>
                    </div>

                    {/* Cost */}
                    <div className="flex items-start">
                        <Tag size={16} className="text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                         <div className='flex flex-col text-left'>
                            <p className="font-medium text-gray-700">Expected Cost</p>
                            <p className="text-gray-500">{attraction.priceLevel} ({formatCost(attraction.expectedCost)})</p>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-start">
                        <Clock size={16} className="text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                         <div className='flex flex-col text-left'>
                            <p className="font-medium text-gray-700">Duration</p>
                            <p className="text-gray-500">{formatDuration(attraction.durationMin)}</p>
                        </div>
                    </div>

                    {/* Opening Hours */}
                    <div className="flex items-start">
                        <Clock size={16} className="text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                         <div className='flex flex-col text-left'>
                            <p className="font-medium text-gray-700">Hours</p>
                            <p className="text-gray-500">{attraction.openingHours || "Check locally"}</p>
                        </div>
                    </div>

                    {/* Planned Visit */}
                    <div className="flex items-start">
                        <Calendar size={16} className="text-violet-600 mr-2 flex-shrink-0 mt-0.5" />
                         <div className='flex flex-col text-left'>
                            <p className="font-medium text-gray-700">Planned Visit</p>
                            <p className="text-gray-500 font-semibold">
                                {attraction.planning ? attraction.planning : "Not planned yet"}
                            </p>
                        </div>
                    </div>
                </div>
              </div>
            </ListItem>
          );
        })}
      </div>

      {trip.attractions.length === 0 && (
        <div className="text-center py-8 text-gray-500 italic max-w-3xl mx-auto">
          No attractions have been added for this trip yet.
        </div>
      )}

      {/* ===== Modal Add/Edit Attraction ===== */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{isEditing ? "Edit Attraction" : "Add Attraction"}</h3>
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
              <label className="text-sm font-medium text-gray-700">Attraction name</label>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Louvre Museum,..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />

              {/* Category */}
              <label className="text-sm font-medium text-gray-700">Category</label>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Museum / Landmark / Nature..."
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
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 75001 Paris, France"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              {/* Description */}
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                placeholder="Provide a detailed summary of the attraction..."
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
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 4.8"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />

              {/* Price Level */}
              <label className="text-sm font-medium text-gray-700">Price level</label>
              <select
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priceLevel}
                onChange={(e) => setPriceLevel(e.target.value)}
              >
                <option value="">Select price level</option>
                <option value="Free">Free</option>
                <option value="$">$ – Cheap</option>
                <option value="$$">$$ – Moderate</option>
                <option value="$$$">$$$ – Expensive</option>
                <option value="$$$$">$$$$ – Luxury</option>
              </select>

              {/* Expected cost */}
              <label className="text-sm font-medium text-gray-700">Expected cost (Kr)</label>
              <input
                type="number"
                min="0"
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 150"
                value={expectedCost}
                onChange={(e) => setExpectedCost(e.target.value)}
              />

              {/* Duration */}
              <label className="text-sm font-medium text-gray-700">Typical duration (minutes)</label>
              <input
                type="number"
                min="0"
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 120"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
              />

              {/* Opening hours */}
              <label className="text-sm font-medium text-gray-700">Opening hours</label>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 09:00–17:00"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
              />

              {/* Planning (Modal version - uses trip constraints) */}
              <label className="text-sm font-medium text-gray-700">Planned visit (date)</label>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        ? "border-blue-500"
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
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
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
              Are you sure you want to delete **{attractionToDelete?.title || 'this item'}**? This cannot be undone.
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

export default AttractionsList;
