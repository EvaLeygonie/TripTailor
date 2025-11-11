import { createContext, useEffect, useState } from "react";
import mockTrips from "../data/mockTrips.jsx";
const TripsContext = createContext({
  trips: [],
  setTrips: () => { },
  addTrip: () => { },
  updateTrip: () => { },
  removeTrip: () => { },
  addAttraction: () => { },
  removeAttraction: () => { },
  addRestaurant: () => { },
  editAttraction: () => { },
  removeRestaurant: () => { },
  editRestaurant: () => { },
  toggleMustSee: () => { },
  addExpense: () => { },
  editExpense: () => { },
  removeExpense: () => { },
  setBudgetTotal: () => { },
  setExpensePaid: () => { },
  addBreakdownItem: () => { },
  setBreakdownValue: () => { },
  renameBreakdownCategory: () => { },
  removeBreakdownItem: () => { },
  getTripSpent: () => 0,
  getOngoingSpentTotal: () => 0,
  setPlannedTotal: () => { },
});

export { TripsContext };
function normalizeBudget(trip) {
  const safeMustSeeIds = Array.isArray(trip?.mustSeeIds)
    ? trip.mustSeeIds
    : Array.isArray(trip?.mustSees)
      ? trip.mustSees
      : [];

  const safeAttractions = Array.isArray(trip?.attractions)
    ? trip.attractions
    : [];
  const safeRestaurants = Array.isArray(trip?.restaurants)
    ? trip.restaurants
    : [];

  const safePacking = Array.isArray(trip?.packingList) ? trip.packingList : [];

  const b = trip.budget || {};
  if (Array.isArray(b.expenses)) {
    return {
      ...trip,
      mustSeeIds: safeMustSeeIds,
      attractions: safeAttractions,
      restaurants: safeRestaurants,
      packingList: safePacking,
      budget: {
        total: Number(b.total || 0),
        expenses: (b.expenses || []).map((e) => ({
          ...e,
          id: e.id || crypto.randomUUID(),
          amount: Number(e.amount || 0),
          isPaid: typeof e.isPaid === "boolean" ? e.isPaid : false,
        })),
      },
    };
  }
  const bd = b.breakdown || {};
  const expenses = Object.entries(bd).map(([k, v]) => ({
    id: crypto.randomUUID(),
    title:
      k === "flights"
        ? "Flights"
        : k === "accommodation"
          ? "Accommodation"
          : k === "food"
            ? "Food & Drinks"
            : k === "transport"
              ? "Local transport"
              : k === "activities"
                ? "Activities"
                : "Other",
    amount: Number(v || 0),
    category:
      k === "flights"
        ? "Transport"
        : k === "accommodation"
          ? "Accommodation"
          : k === "food"
            ? "Food & Drinks"
            : k === "transport"
              ? "Transport"
              : k === "activities"
                ? "Activities"
                : "Other",
    isPaid: false,
  }));
  return {
    ...trip,
    mustSeeIds: safeMustSeeIds,
    attractions: safeAttractions,
    restaurants: safeRestaurants,
    packingList: safePacking,
    budget: { total: Number(b.total || 0), expenses },
  };
}
export function TripsProvider({ children }) {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem("trips");
    const base = saved ? JSON.parse(saved) : mockTrips;
    return base.map(normalizeBudget);
  });

  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(trips));
  }, [trips]);

  function patchTrip(tripId, updater) {
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updater(t) : t)));
  }

  const addTrip = (newTrip) =>
    setTrips((prev) => [...prev, normalizeBudget(newTrip)]);
  const removeTrip = (id) =>
    setTrips((prev) => prev.filter((trip) => trip.id !== id));

  const addAttraction = (tripId, attraction) =>
    patchTrip(tripId, (t) => ({
      ...t,
      attractions: [...t.attractions, attraction],
    }));

  const updateTrip = (updatedTrip) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === updatedTrip.id ? normalizeBudget(updatedTrip) : t
      )
    );
  };

  const removeAttraction = (tripId, attractionId) => {
    setTrips(prevTrips => {
      const newTrips = prevTrips.map(trip => {
        if (trip.id === tripId) {
          const newAttractions = trip.attractions.filter(a => a.id !== attractionId)

          const mappedActivities = newAttractions
            .filter(a => a.planning?.trim())
            .map(a => ({
              ...a,
              name: a.title,
              type: "Attraction",
              time: a.time || "",
              endTime: a.endTime || ""
            }))

          localStorage.setItem(`activities_${tripId}`, JSON.stringify(mappedActivities))

          return { ...trip, attractions: newAttractions }
        }
        return trip
      })
      return newTrips
    });
  }

  // IMPLEMENTERAD: Uppdaterar en befintlig attraktion

  const editAttraction = (tripId, attractionId, updatedData) => {
    setTrips(prevTrips => {
      const newTrips = prevTrips.map(trip => {
        if (trip.id === tripId) {
          const newAttractions = trip.attractions.map(a =>
            a.id === attractionId ? { ...a, ...updatedData } : a
          );
          const savedActivities = newAttractions
            .filter(a => a.planning?.trim())
            .map(a => ({
              ...a,
              name: a.title,
              type: "Attraction",
              time: a.time || "",
              endTime: a.endTime || ""
            }))
          localStorage.setItem(`activities_${tripId}`, JSON.stringify(savedActivities))
          return { ...trip, attractions: newAttractions }
        }
        return trip
      })
      return newTrips
    })
  }

  const clearAttractionPlanning = (tripId, attractionId) => {
    setTrips(prevTrips => {
      const newTrips = prevTrips.map(trip => {
        if (trip.id === tripId) {
          const newAttractions = trip.attractions.map(a =>
            a.id === attractionId ? { ...a, planning: "" } : a
          )

          const mappedActivities = newAttractions
            .filter(a => a.planning?.trim())
            .map(a => ({
              ...a,
              name: a.title,
              type: "Attraction",
              time: a.time || "",
              endTime: a.endTime || "",
            }));
          localStorage.setItem(`activities_${tripId}`, JSON.stringify(mappedActivities));

          return { ...trip, attractions: newAttractions };
        }
        return trip;
      })
      return newTrips;
    })
  }


  const addRestaurant = (tripId, restaurant) =>
    patchTrip(tripId, (t) => ({
      ...t,
      restaurants: [...t.restaurants, restaurant],
    }));

  const removeRestaurant = (tripId, restaurantId) => {
    setTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id === tripId) {
          const newRestaurants = trip.restaurants.filter(r => r.id !== restaurantId)

          const plannedActivities = [
            ...trip.attractions.filter(a => a.planning?.trim()).map(a => ({
              ...a,
              name: a.title,
              type: "Attraction",
              time: a.time || "",
              endTime: a.endTime || "",
            })),
            ...newRestaurants.filter(r => r.planning?.trim()).map(r => ({
              ...r,
              name: r.title,
              type: "Restaurant",
              time: r.time || "",
              endTime: r.endTime || "",
            }))
          ]

          localStorage.setItem(`activities_${tripId}`, JSON.stringify(plannedActivities))

          return { ...trip, restaurants: newRestaurants }
        }
        return trip;
      })
    })
  }

  // IMPLEMENTERAD: Uppdaterar en befintlig restaurang
  const editRestaurant = (tripId, restaurantId, updatedData) => {
    setTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id === tripId) {
          const newRestaurants = trip.restaurants.map(r =>
            r.id === restaurantId ? { ...r, ...updatedData } : r
          )

          const plannedActivities = [
            ...trip.attractions.filter(a => a.planning?.trim()).map(a => ({
              ...a,
              name: a.title,
              type: "Attraction",
              time: a.time || "",
              endTime: a.endTime || "",
            })),
            ...newRestaurants.filter(r => r.planning?.trim()).map(r => ({
              ...r,
              name: r.title,
              type: "Restaurant",
              time: r.time || "",
              endTime: r.endTime || "",
            }))
          ]

          localStorage.setItem(`activities_${tripId}`, JSON.stringify(plannedActivities))

          return { ...trip, restaurants: newRestaurants }
        }
        return trip
      })
    })
  }


  // Clear planned date for a specific restaurant
  const clearRestaurantPlanning = (tripId, restaurantId) => {
    setTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id === tripId) {
          const newRestaurants = trip.restaurants.map(r =>
            r.id === restaurantId ? { ...r, planning: "" } : r
          );

          // Also update localStorage for calendar view
          const plannedRestaurants = newRestaurants
            .filter(r => r.planning?.trim())
            .map(r => ({
              ...r,
              name: r.title,
              type: "Restaurant",
              time: r.time || "",
              endTime: r.endTime || "",
            }))
          localStorage.setItem(`activities_${tripId}`, JSON.stringify(plannedRestaurants))

          return { ...trip, restaurants: newRestaurants }
        }
        return trip;
      })
    })
  }


  // IMPLEMENTERAD: toggleMustSee
  const toggleMustSee = (tripId, itemId) => {
    patchTrip(tripId, (t) => {
      const mustSeeIds = t.mustSeeIds || [];
      const isMustSee = mustSeeIds.includes(itemId);

      if (isMustSee) {
        // Ta bort objektet från mustSeeIds
        return {
          ...t,
          mustSeeIds: mustSeeIds.filter((id) => id !== itemId),
        };
      } else {
        // Lägg till objektet i mustSeeIds
        return {
          ...t,
          mustSeeIds: [...mustSeeIds, itemId],
        };
      }
    });
  };

  function updateTripBudget(tripId, updater) {
    patchTrip(tripId, (t) => {
      const b = t.budget || { total: 0, expenses: [] };
      const safe = {
        total: Number(b.total ?? 0),
        expenses: Array.isArray(b.expenses) ? b.expenses : [],
      };
      const next = updater(safe);
      return { ...t, budget: next };
    });
  }

  function addExpense(tripId, expense) {
    updateTripBudget(tripId, (b) => ({
      ...b,
      expenses: [
        ...b.expenses,
        {
          id: crypto.randomUUID(),
          title: String(expense.title || "").trim(),
          amount: Number(expense.amount || 0),
          category: expense.category || "Other",
          isPaid: !!expense.isPaid,
        },
      ],
    }));
  }

  function editExpense(tripId, expenseId, patch) {
    updateTripBudget(tripId, (b) => ({
      ...b,
      expenses: b.expenses.map((e) =>
        e.id === expenseId
          ? {
            ...e,
            ...patch,
            amount: Number((patch?.amount ?? e.amount) || 0),
          }
          : e
      ),
    }));
  }

  function removeExpense(tripId, expenseId) {
    updateTripBudget(tripId, (b) => ({
      ...b,
      expenses: b.expenses.filter((e) => e.id !== expenseId),
    }));
  }

  function setBudgetTotal(tripId, total) {
    updateTripBudget(tripId, (b) => ({ ...b, total: Number(total || 0) }));
  }

  function setExpensePaid(tripId, expenseId, isPaid) {
    updateTripBudget(tripId, (b) => ({
      ...b,
      expenses: b.expenses.map((e) =>
        e.id === expenseId ? { ...e, isPaid: !!isPaid } : e
      ),
    }));
  }

  function getTripSpent(trip) {
    if (!trip || !trip.budget) return 0;
    const status = trip.tripStatus || "planned";
    if (status === "planned") return 0;
    const list = (trip.budget.expenses || []).filter((e) => e.isPaid);
    return list.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }

  function getOngoingSpentTotal() {
    return trips
      .filter((t) => t.tripStatus === "ongoing")
      .reduce((sum, t) => sum + getTripSpent(t), 0);
  }

  function addBreakdownItem(tripId, category, amount) {
    const title = String(category || "").trim();
    const mappedCategory =
      title.toLowerCase() === "flights"
        ? "Transport"
        : title.toLowerCase() === "accommodation"
          ? "Accommodation"
          : title.toLowerCase().includes("food")
            ? "Food & Drinks"
            : title.toLowerCase().includes("transport")
              ? "Transport"
              : title.toLowerCase().includes("activit")
                ? "Activities"
                : "Other";
    addExpense(tripId, {
      title,
      amount: Number(amount || 0),
      category: mappedCategory,
      isPaid: false,
    });
  }

  function setBreakdownValue(tripId, category, amount) {
    const title = String(category || "").trim();
    const trip = trips.find((t) => t.id === tripId);
    const match = trip?.budget?.expenses?.find((e) => e.title === title);
    if (match) {
      editExpense(tripId, match.id, { amount: Number(amount || 0) });
    } else {
      addBreakdownItem(tripId, title, amount);
    }
  }

  function renameBreakdownCategory(tripId, oldKey, newKey) {
    const trip = trips.find((t) => t.id === tripId);
    const exp = trip?.budget?.expenses?.find((e) => e.title === oldKey);
    if (!exp) return;
    const mappedCategory =
      (newKey || "").toLowerCase() === "flights"
        ? "Transport"
        : (newKey || "").toLowerCase() === "accommodation"
          ? "Accommodation"
          : (newKey || "").toLowerCase().includes("food")
            ? "Food & Drinks"
            : (newKey || "").toLowerCase().includes("transport")
              ? "Transport"
              : (newKey || "").toLowerCase().includes("activit")
                ? "Activities"
                : "Other";
    editExpense(tripId, exp.id, { title: newKey, category: mappedCategory });
  }

  function removeBreakdownItem(tripId, category) {
    const title = String(category || "").trim();
    const trip = trips.find((t) => t.id === tripId);
    const match = trip?.budget?.expenses?.find((e) => e.title === title);
    if (match) removeExpense(tripId, match.id);
  }

  function setPlannedTotal(tripId, total) {
    setBudgetTotal(tripId, total);
  }

  const contextValue = {
    trips,
    setTrips,
    addTrip,
    updateTrip,
    removeTrip,
    addAttraction,
    removeAttraction,
    editAttraction, // NU IMPLEMENTERAD
    addRestaurant,
    removeRestaurant,
    editRestaurant, // NU IMPLEMENTERAD
    toggleMustSee, // NU IMPLEMENTERAD
    addExpense,
    editExpense,
    removeExpense,
    setBudgetTotal,
    setExpensePaid,
    addBreakdownItem,
    setBreakdownValue,
    renameBreakdownCategory,
    removeBreakdownItem,
    getTripSpent,
    getOngoingSpentTotal,
    setPlannedTotal,
    clearAttractionPlanning,
    clearRestaurantPlanning,
  };

  return (
    <TripsContext.Provider value={contextValue}>
      {children}
    </TripsContext.Provider>
  );
}
