import { useState, useEffect } from "react";
import { coverImages } from "../data/mockImages.jsx";
import { Circle, Save, Plus, Edit3 } from "lucide-react";

export default function TripForm({
  onAddTrip,
  tripToEdit,
  onSaveEdit,
  isEditing,
}) {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [selectedCover, setSelectedCover] = useState("");
  const [tripStatus, setTripStatus] = useState("planned");

  const statusColors = {
    planned: "text-blue-500",
    ongoing: "text-yellow-500",
    completed: "text-green-500",
  };

  useEffect(() => {
    if (tripToEdit) {
      setTitle(tripToEdit.title || "");
      setCity(tripToEdit.destination?.city || "");
      setCountry(tripToEdit.destination?.country || "");
      setStart(tripToEdit.dates?.start || "");
      setEnd(tripToEdit.dates?.end || "");
      setSelectedCover(tripToEdit.coverImage || "");
      setTripStatus(tripToEdit.tripStatus || "planned");
    }
  }, [tripToEdit]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !city || !country || !start || !end || !selectedCover) return;

    const tripData = {
      id: tripToEdit?.id || Date.now().toString(),
      title: title.trim(),
      destination: { city: city.trim(), country: country.trim() },
      dates: { start, end },
      coverImage: selectedCover,
      tripStatus,
      mustSees: tripToEdit?.mustSees || [],
      mustSeeIds: Array.isArray(tripToEdit?.mustSeeIds)
        ? tripToEdit.mustSeeIds
        : Array.isArray(tripToEdit?.mustSees)
        ? tripToEdit.mustSees
        : [],
      attractions: tripToEdit?.attractions || [],
      restaurants: tripToEdit?.restaurants || [],
      budget: tripToEdit?.budget || { total: 0, spent: 0, breakdown: {} },
    };

    isEditing ? onSaveEdit?.(tripData) : onAddTrip?.(tripData);

    setTitle("");
    setCity("");
    setCountry("");
    setStart("");
    setEnd("");
    setSelectedCover("");
    setTripStatus("planned");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:grid sm:grid-cols-2 gap-4 my-4 border border-gray-200 p-5 sm:p-8 rounded-2xl bg-white shadow-lg max-w-3xl mx-auto"
    >
      <h3 className="col-span-full font-bold text-2xl mb-2 text-gray-800 text-center sm:text-left">
        {isEditing ? "Edit Trip" : "Add Your New Trip"}
      </h3>

      <input
        type="text"
        placeholder="Trip title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
        className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        required
        className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <div>
        <label className="text-sm font-medium mb-1 block">Start date</label>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
          className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">End date</label>
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
          className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Status</label>
        <div className="flex items-center gap-2">
          <Circle
            className={`h-4 w-4 ${statusColors[tripStatus]}`}
            fill="currentColor"
          />
          <select
            value={tripStatus}
            onChange={(e) => setTripStatus(e.target.value)}
            required
            className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="col-span-full">
        <label className="text-sm font-medium mb-1 block">
          Choose a cover image
        </label>
        <select
          value={selectedCover}
          onChange={(e) => setSelectedCover(e.target.value)}
          required
          className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">— Choose an image —</option>
          {coverImages.map((opt) => (
            <option key={opt.id} value={opt.url}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {selectedCover && (
        <img
          src={selectedCover}
          alt="Cover preview"
          className="col-span-full w-full aspect-video object-cover border border-gray-200 rounded-xl shadow-md"
        />
      )}

      <button
        type="submit"
        className="col-span-full mt-4 bg-gradient-to-r from-purple-700 to-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:opacity-90 active:scale-95 transition duration-150 flex items-center justify-center gap-2 font-semibold"
      >
        {isEditing ? (
          <>
            <Save size={18} /> Save Changes
          </>
        ) : (
          <>
            <Plus size={18} /> Add Trip
          </>
        )}
      </button>
    </form>
  );
}
