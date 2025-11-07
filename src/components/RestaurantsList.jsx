import { Plus, X } from "lucide-react";
import { useParams } from "react-router-dom";
import tripsData from "../data/mockTrips.jsx";
import { coverImages } from "../data/mockImages.jsx";
import ListItem from "./ListItem.jsx";
import { useState, useContext } from "react";
import { TripsContext } from "../context/TripsContext";

const RestaurantsList = () => {
  const { id } = useParams();

  const { trips, addRestaurant, editRestaurant, removeRestaurant, toggleMustSee } = useContext(TripsContext);
  const ctxTrip = trips.find((t) => t.id === id);
  const fallbackTrip = tripsData.find((t) => t.id === id);
  const trip = ctxTrip || fallbackTrip;

  //Confirm delete
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  const mustSeeIds = trip ? trip.mustSeeIds : [];

  // Modal Add
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [priceLevel, setPriceLevel] = useState("€€");
  const [expectedCost, setExpectedCost] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [selectedImage, setSelectedImage] = useState(coverImages[0]?.url || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!trip) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading trip data or trip ID not found in URL.
      </div>
    );
  }

  // Category list
  const suggestedCategories = [
    "Restaurant",
    "Café / Coffee",
    "Bakery",
    "Tapas Bar",
    "Seafood",
    "Vegetarian / Vegan",
    "Street Food",
    "Fine Dining",
    "Casual Dining",
    "Bar",
    "Wine Bar",
    "Dessert",
  ];

  // Helper to reset all form fields
  const resetForm = () => {
    setName("");
    setCategory("");
    setRating("");
    setPriceLevel("$$");
    setExpectedCost("");
    setDurationMin("");
    setOpeningHours("");
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

  // NEW: Handle Edit: Set state to 'Edit' mode and populate fields
  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditingItemId(item.id);
    setName(item.title || "");
    setCategory(item.category || "");
    setRating(item.rating || "");
    setPriceLevel(item.priceLevel || "$$");
    setExpectedCost(item.expectedCost || "");
    setDurationMin(item.durationMin || "");
    setOpeningHours(item.openingHours || "");
    setSelectedImage(item.image || coverImages[0]?.url);
    setError("");
    setOpen(true);
  }

  // NEW: Handle Delete
  const handleDeleteClick = (itemId) => {
    setItemToDeleteId(itemId);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDeleteId) {
      removeRestaurant(trip.id, itemToDeleteId);
    }
    setItemToDeleteId(null);
    setShowConfirmation(false);
  }

  const handleCancelDelete = () => {
    setItemToDeleteId(null);
    setShowConfirmation(false);
  }

  // Handle Form Submission (Add or Edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a restaurant name.");
      return;
    }
    setSaving(true);

    const itemData = {
      title: name.trim(),
      category: category.trim() || "Restaurant",
      address: "", // Address not in form, keeping it empty/static
      rating: rating ? parseFloat(rating) : null,
      priceLevel,
      expectedCost: expectedCost ? parseFloat(expectedCost) : 0,
      durationMin: durationMin ? parseInt(durationMin) : 90,
      openingHours: openingHours || "",
      image: selectedImage,
    };

    try {
      if (isEditing && editingItemId) {
        // EDIT MODE
        editRestaurant(trip.id, editingItemId, itemData);
      } else {
        // ADD MODE
        const newRestaurant = {
          ...itemData,
          id: `r_${Date.now()}`, // Generate unique ID only for new items
        };
        addRestaurant(trip.id, newRestaurant);
      }

      resetForm();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const restaurantToDelete = trip.restaurants.find(r => r.id === itemToDeleteId);

  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow-lg mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Restaurants</h2>
        
        <button
          onClick={handleAddClick}
          className="bg-gradient-to-b from-violet-500 to-violet-700 text-white flex items-center space-x-2 px-4 py-2 font-medium rounded-lg shadow-md hover:from-violet-600 hover:to-violet-800 transition-all duration-200 ease-in-out"
        >
          <Plus size={20} />
          <span>Add</span>
        </button>
      </div>

      <div className="space-y-4">
        {trip.restaurants.map((restaurant) => (
          <article
            key={restaurant.id}
            className="cursor-pointer text-left overflow-hidden rounded-xl shadow-md transition-transform duration-300 ease-out
            hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-gray-50"
          >
            <ListItem
              key={restaurant.id}
              item={restaurant}
              type="restaurant"
              // Use mustSeeIds for initial 'favorite' state display
              isMustSee={mustSeeIds.includes(restaurant.id)}
              // Connect Toggle Favorite funciton
              onToggleFavorite={() => toggleMustSee(trip.id, restaurant.id)}
              // Connect Edit/Delete handlers
              onEdit={() => handleEditClick(restaurant)}
              onDelete={() => handleDeleteClick(restaurant.id)}
            />
          </article>
        ))}
      </div>

      {trip.restaurants.length === 0 && (
        <div className="text-center py-8 text-gray-500 italic">
          No restaurants have been added for this trip yet.
        </div>
      )}
      {/* ===== Modal Add/Edit Restaurant (Logic updated to handle both) ===== */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="mb-3 flex items-center justify-between">
              {/* Dynamic Modal Title */}
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
              {/* Form Fields are unchanged, but now use and update state correctly for both modes */}

              {/* Name */}
              <label className="text-sm font-medium text-gray-700">Restaurant name</label>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. La Piadina,..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />

              {/* Category */}
              <label className="text-sm font-medium text-gray-700">Category</label>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Café / Tapas Bar / Bakery..."
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
                placeholder="e.g. 4.5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />

              {/* Price level */}
              <label className="text-sm font-medium text-gray-700">Price level</label>
              <select
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priceLevel}
                onChange={(e) => setPriceLevel(e.target.value)}
              >
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
                placeholder="e.g. 30"
                value={expectedCost}
                onChange={(e) => setExpectedCost(e.target.value)}
              />

              {/* Duration */}
              <label className="text-sm font-medium text-gray-700">Typical duration (minutes)</label>
              <input
                type="number"
                min="0"
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 90"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
              />

              {/* Opening hours */}
              <label className="text-sm font-medium text-gray-700">Opening hours</label>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 08:00–23:00"
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
