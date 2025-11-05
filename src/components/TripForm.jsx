// src/components/TripForm.jsx
import { useState } from "react";
import { coverImages } from "../data/mockImages.jsx";

export default function TripForm({ onAddTrip }) {
  // sparar tillfälliga värden för inputfält
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [selectedCover, setSelectedCover] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (
      !title.trim() ||
      !city.trim() ||
      !country.trim() ||
      !start ||
      !end ||
      !selectedCover
    )
      return;

    // skapa nytt trip-objekt
    const newTrip = {
      id: Date.now().toString(),
      title: title.trim(),
      destination: { city: city.trim(), country: country.trim() },
      dates: { start, end },
      coverImage: selectedCover, //
      mustSees: [],
      attractions: [],
      restaurants: [],
      tripStatus: "planned",
      budget: {
        total: 0,
        spent: 0,
        breakdown: {},
      },
    }

    onAddTrip?.(newTrip)


    // Rensa fält (inklusive vald bild)
    setTitle("");
    setCity("");
    setCountry("");
    setStart("");
    setEnd("");
    setSelectedCover("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: 8,
        margin: "16px 0",
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 8,
      }}
    >
      <h3>Add your new trip</h3>

      <input
        type="text"
        placeholder="Trip title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        required
      />

      <label style={{ display: "grid", gap: 4 }}>
        Start date:
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
      </label>

      <label style={{ display: "grid", gap: 4 }}>
        End date:
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
      </label>

      {/* Välj omslagsbild från mockImages */}
      <label style={{ display: "grid", gap: 4 }}>
        Choose a cover image:
        <select
          value={selectedCover}
          onChange={(e) => setSelectedCover(e.target.value)}
          required
        >
          <option value="">— Choose an image —</option>
          {coverImages.map((opt) => (
            <option key={opt.id} value={opt.url}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      {/* Förhandsvisning (visas endast om något är valt) */}
      {selectedCover && (
        <img
          src={selectedCover}
          alt="Cover preview"
          style={{
            width: "100%",
            maxWidth: 420,
            aspectRatio: "16 / 9",
            objectFit: "cover",
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        />
      )}

      <button type="submit" style={{ marginTop: 8 }}>
        ➕ Add Trip
      </button>
    </form>
  )
}
