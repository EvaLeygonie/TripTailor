// TripsContext.jsx
import { createContext, useState, useEffect } from "react";
import mockTrips from "../data/mockTrips";

const TripsContext = createContext({
  trips: [], // Use an array for trips
  setTrips: () => {},
  addTrip: () => {},
  removeTrip: () => {},
  addAttraction: () => {},
  removeAttraction: () => {},
  addRestaurant: () => {},
  removeRestaurant: () => {},
  addBreakdownItem: () => {},
  setBreakdownValue: () => {},
  renameBreakdownCategory: () => {},
  removeBreakdownItem: () => {},
  getTripSpent: () => 0,
  getOngoingSpentTotal: () => 0,
  setPlannedTotal: () => {},
});

export function TripsProvider({ children }) {
  const [trips, setTrips] = useState(() => {
    const savedTrips = localStorage.getItem("trips");
    return savedTrips ? JSON.parse(savedTrips) : mockTrips;
  });

  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(trips));
  }, [trips]);

  // Liten hjälpare för att uppdatera en specifik resa
  function patchTrip(tripId, updater) {
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updater(t) : t)));
  }

  const addTrip = (newTrip) => {
    setTrips((prev) => [...prev, newTrip]);
  };

  const removeTrip = (id) => {
    const updatedTrips = trips.filter((trip) => trip.id !== id);
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
  };

  const addAttraction = (tripId, attraction) => {
    const updatedTrips = trips.map((trip) => {
      if (trip.id === tripId) {
        return {
          ...trip,
          attractions: [...trip.attractions, attraction],
        };
      }
      return trip;
    });
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
  };

  const removeAttraction = (tripId, attractionId) => {
    const updatedTrips = trips.map((trip) => {
      if (trip.id === tripId) {
        return {
          ...trip,
          attractions: trip.attractions.filter((a) => a.id !== attractionId),
        };
      }
      return trip;
    });
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
  };

  const addRestaurant = (tripId, restaurant) => {
    const updatedTrips = trips.map((trip) => {
      if (trip.id === tripId) {
        return {
          ...trip,
          restaurants: [...trip.restaurants, restaurant],
        };
      }
      return trip;
    });
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
  };

  const removeRestaurant = (tripId, restaurantId) => {
    const updatedTrips = trips.map((trip) => {
      if (trip.id === tripId) {
        return {
          ...trip,
          restaurants: trip.restaurants.filter((r) => r.id !== restaurantId),
        };
      }
      return trip;
    });
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
  };

  // ---- Budget: breakdown CRUD ----

  // Lägg till/ersätt en kostnadspost i breakdown
  const addBreakdownItem = (tripId, category, amount) =>
    patchTrip(tripId, (t) => ({
      ...t,
      budget: {
        ...(t.budget || {}),
        breakdown: {
          ...((t.budget && t.budget.breakdown) || {}),
          [category]: Number(amount) || 0,
        },
      },
    }));

  // Sätt belopp för befintlig kategori
  const setBreakdownValue = (tripId, category, amount) =>
    patchTrip(tripId, (t) => {
      const bd = { ...((t.budget || {}).breakdown || {}) };
      if (!(category in bd)) return t;
      bd[category] = Number(amount) || 0;
      return { ...t, budget: { ...(t.budget || {}), breakdown: bd } };
    });

  // Byt namn på en kategori
  const renameBreakdownCategory = (tripId, oldKey, newKey) =>
    patchTrip(tripId, (t) => {
      if (!newKey || oldKey === newKey) return t;
      const bd = { ...((t.budget || {}).breakdown || {}) };
      if (!(oldKey in bd)) return t;
      const amount = bd[oldKey];
      delete bd[oldKey];
      bd[newKey] = amount;
      return { ...t, budget: { ...(t.budget || {}), breakdown: bd } };
    });

  // Ta bort en kategori
  const removeBreakdownItem = (tripId, category) =>
    patchTrip(tripId, (t) => {
      const bd = { ...((t.budget || {}).breakdown || {}) };
      delete bd[category];
      return { ...t, budget: { ...(t.budget || {}), breakdown: bd } };
    });

  // Summa spenderat för en resa (summa av breakdown)
  const getTripSpent = (trip) => {
    if (!trip || !trip.budget) return 0;
    if (trip.tripStatus === "planned") return 0;
    return Object.values(trip.budget.breakdown || {}).reduce(
      (sum, n) => sum + Number(n || 0),
      0
    );
  };

  // Total spenderat för alla pågående resor
  const getOngoingSpentTotal = () =>
    trips
      .filter((t) => t.tripStatus === "ongoing")
      .reduce((sum, t) => sum + getTripSpent(t), 0);

  const setPlannedTotal = (tripId, total) =>
    patchTrip(tripId, (t) => ({
      ...t,
      budget: {
        ...(t.budget || {}),
        total: Number(total) || 0,
      },
    }));

  // 💡 If you load mock data, load it here!

  const contextValue = {
    trips,
    setTrips,
    addTrip,
    removeTrip,
    addAttraction,
    removeAttraction,
    addRestaurant,
    removeRestaurant,
    addBreakdownItem,
    setBreakdownValue,
    renameBreakdownCategory,
    removeBreakdownItem,
    getTripSpent,
    getOngoingSpentTotal,
    setPlannedTotal,
  };

  return (
    <TripsContext.Provider value={contextValue}>
      {children}
    </TripsContext.Provider>
  );
}

export { TripsContext }; // Export the context itself for use in components
