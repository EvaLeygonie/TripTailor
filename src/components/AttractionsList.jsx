import { Plus, X } from 'lucide-react'
import { useParams } from 'react-router-dom'
import tripsData from '../data/mockTrips.jsx'
import { coverImages } from "../data/mockImages.jsx";
import ListItem from './ListItem.jsx'
import { useState, useContext } from 'react'
import { TripsContext } from '../context/TripsContext'

const AttractionsList = () => {
  const { id } = useParams()

  // 1. Context and Data
  const { trips, addAttraction, editAttraction, removeAttraction, toggleMustSee } = useContext(TripsContext);
  const ctxTrip = trips.find((t) => t.id === id);
  const fallbackTrip = tripsData.find((t) => t.id === id);
  const trip = ctxTrip || fallbackTrip;

  // 2. State for Confirmation Modal
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  // 3. State for Add/Edit Modal
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [expectedCost, setExpectedCost] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [selectedImage, setSelectedImage] = useState(coverImages[0]?.url || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const mustSeeIds = trip ? trip.mustSeeIds : [];

  if (!trip) {
    return <div className="p-4 text-center text-gray-500">Loading trip data or trip ID not found in URL.</div>
  }

  // Attraction Category list
  const suggestedCategories = [
    "Nature", "Landmark", "Museum", "Sightseeing", "Entertainment",
    "Historical Site", "Art Gallery", "Park", "Beach", "Religious Site",
    "Theme Park", "Shopping",
  ];

  // Helper to reset all form fields
  const resetForm = () => {
    setName("");
    setCategory("");
    setRating("");
    setExpectedCost("");
    setDurationMin("");
    setOpeningHours("");
    setSelectedImage(coverImages[0]?.url || "");
    setEditingItemId(null);
    setIsEditing(false);
    setError("");
    setSaving(false);
  }

  // --- Handlers for CRUD ---

  const handleAddClick = () => {
    resetForm();
    setOpen(true);
  };

  // Handle Edit: Set state to 'Edit' mode and populate fields
  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditingItemId(item.id);
    setName(item.title || "");
    setCategory(item.category || "");
    setRating(item.rating || "");
    setExpectedCost(item.expectedCost || "");
    setDurationMin(item.durationMin || "");
    setOpeningHours(item.openingHours || "");
    setSelectedImage(item.image || coverImages[0]?.url);
    setError("");
    setOpen(true);
  }

  // Handle Delete: Store ID and show confirmation
  const handleDeleteClick = (itemId) => {
      setItemToDeleteId(itemId);
      setShowConfirmation(true);
  };

  // Confirmation: Confirm deletion and call context function
  const handleConfirmDelete = () => {
    if (itemToDeleteId) {
      removeAttraction(trip.id, itemToDeleteId);
    }
    setItemToDeleteId(null);
    setShowConfirmation(false);
  }

  // Confirmation: Cancel deletion
  const handleCancelDelete = () => {
    setItemToDeleteId(null);
    setShowConfirmation(false);
  }


  // Handle Form Submission (Add or Edit)
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
      address: "",
      rating: rating ? parseFloat(rating) : null,
      expectedCost: expectedCost ? parseFloat(expectedCost) : 0,
      durationMin: durationMin ? parseInt(durationMin) : 120,
      openingHours: openingHours || "",
      image: selectedImage,
    };

    try {
      if (isEditing && editingItemId) {
        // EDIT MODE
        editAttraction(trip.id, editingItemId, itemData);
      } else {
        // ADD MODE
        const newAttraction = {
          ...itemData,
          id: `a_${Date.now()}`, // Generate unique ID only for new items
        };
        addAttraction(trip.id, newAttraction);
      }

      resetForm();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  // Find the attraction name for the confirmation modal title
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

      <div className="space-y-4">
        {trip.attractions.map(attraction => (
          <article
            key={attraction.id}
            className="cursor-pointer text-left overflow-hidden rounded-xl shadow-md transition-transform duration-300 ease-out
            hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-white"
          >
          <ListItem
            key={attraction.id}
            item={attraction}
            type="attraction"
            isMustSee={mustSeeIds.includes(attraction.id)}
            // Connect all handlers
            onToggleFavorite={() => toggleMustSee(trip.id, attraction.id)}
            onEdit={() => handleEditClick(attraction)}
            onDelete={() => handleDeleteClick(attraction.id)}
          />
          </article>
        ))}
      </div>

      {trip.attractions.length === 0 && (
        <div className="text-center py-8 text-gray-500 italic ">
          No attractions have been added for this trip yet.
        </div>
      )}

      {/* ===== 1. Modal Add/Edit Attraction ===== */}
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
                placeholder="e.g. Landmark / Museum / Nature..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="categoryOptions"
              />
              <datalist id="categoryOptions">
                {suggestedCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>

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

      {/* ===== 2. Custom Delete Confirmation Modal (Global Overlay) ===== */}
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
