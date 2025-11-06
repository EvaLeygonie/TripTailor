import { Plus, X } from "lucide-react";
import { useParams } from "react-router-dom";
import tripsData from "../data/mockTrips.jsx";
import { coverImages } from "../data/mockImages.jsx";
import ListItem from "./ListItem.jsx";
import { useState, useContext } from "react";
import { TripsContext } from "../context/TripsContext";

const RestaurantsList = () => {
  const { id } = useParams();

  const { trips, addRestaurant } = useContext(TripsContext);
  const ctxTrip = trips.find((t) => t.id === id);
  const fallbackTrip = tripsData.find((t) => t.id === id);
  const trip = ctxTrip || fallbackTrip;

  const mustSeeIds = trip ? trip.mustSeeIds : [];

  // Modal Add
  const [open, setOpen] = useState(false);
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

  const handleAddClick = () => {
    setError("");
    setName("");
    setCategory("");
    setSelectedImage(coverImages[0]?.url || "");
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a restaurant name.");
      return;
    }
    setSaving(true);
    try {
      const newRestaurant = {
        id: `r_${Date.now()}`,
        title: name.trim(),
        category: category.trim() || "Restaurant",
        address: "",
        rating: rating ? parseFloat(rating) : null,
        priceLevel,
        expectedCost: expectedCost ? parseFloat(expectedCost) : 0,
        durationMin: durationMin ? parseInt(durationMin) : 90,
        openingHours: openingHours || "",
        image: selectedImage,
      };

      addRestaurant(trip.id, newRestaurant);
      // Reset form
      setName("");
      setCategory("Restaurant");
      setRating("");
      setPriceLevel("€€");
      setExpectedCost("");
      setDurationMin("");
      setOpeningHours("");
      setSelectedImage(coverImages[0]?.url || "");
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow-lg mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Restaurants</h2>
        <button
          onClick={handleAddClick}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-150 ease-in-out"
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
              // Inert placeholder function
              onToggleFavorite={() =>
                console.log("Toggle not yet implemented.")
              }
            />
          </article>
        ))}
      </div>

      {trip.restaurants.length === 0 && (
        <div className="text-center py-8 text-gray-500 italic">
          No restaurants have been added for this trip yet.
        </div>
      )}
      {/* ===== Modal Add Restaurant ===== */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Restaurant</h3>
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
              <label className="text-sm font-medium text-gray-700">
                Restaurant name
              </label>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. La Piadina,..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />

              {/* Category */}
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
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
              <label className="text-sm font-medium text-gray-700">
                Rating (1–5)
              </label>
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
              <label className="text-sm font-medium text-gray-700">
                Price level
              </label>
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
              <label className="text-sm font-medium text-gray-700">
                Expected cost (Kr)
              </label>
              <input
                type="number"
                min="0"
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 30"
                value={expectedCost}
                onChange={(e) => setExpectedCost(e.target.value)}
              />

              {/* Duration */}
              <label className="text-sm font-medium text-gray-700">
                Typical duration (minutes)
              </label>
              <input
                type="number"
                min="0"
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 90"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
              />

              {/* Opening hours */}
              <label className="text-sm font-medium text-gray-700">
                Opening hours
              </label>
              <input
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 08:00–23:00"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
              />

              {/* Image selector from mockImages */}
              <label className="text-sm font-medium text-gray-700">
                Select image
              </label>
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
                  {saving ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;
