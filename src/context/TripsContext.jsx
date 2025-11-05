// TripsContext.jsx
import { createContext, useState, useEffect } from 'react'
import mockTrips from "../data/mockTrips"


const TripsContext = createContext({
    trips: [], // Use an array for trips
    setTrips: () => { },
    addTrip: () => { },
    removeTrip: () => { },
    addAttraction: () => { },
    removeAttraction: () => { },
    addRestaurant: () => { },
    removeRestaurant: () => { }
})

export function TripsProvider({ children }) {

    const [trips, setTrips] = useState(() => {
        const savedTrips = localStorage.getItem("trips");
        return savedTrips ? JSON.parse(savedTrips) : mockTrips
    })

    useEffect(() => {
        localStorage.setItem("trips", JSON.stringify(trips))
    }, [trips])

    const addTrip = (newTrip) => {
        setTrips((prev) => [...prev, newTrip])
    }

    const removeTrip = (id) => {
        const updatedTrips = trips.filter(trip => trip.id !== id)
        setTrips(updatedTrips)
        localStorage.setItem('trips', JSON.stringify(updatedTrips))
    }

    const addAttraction = (tripId, attraction) => {
        const updatedTrips = trips.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    attractions: [...trip.attractions, attraction]
                }
            }
            return trip
        })
        setTrips(updatedTrips)
        localStorage.setItem('trips', JSON.stringify(updatedTrips))
    }

    const removeAttraction = (tripId, attractionId) => {
        const updatedTrips = trips.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    attractions: trip.attractions.filter(a => a.id !== attractionId)
                }
            }
            return trip
        })
        setTrips(updatedTrips)
        localStorage.setItem('trips', JSON.stringify(updatedTrips))
    }

    const addRestaurant = (tripId, restaurant) => {
        const updatedTrips = trips.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    restaurants: [...trip.restaurants, restaurant]
                }
            }
            return trip
        })
        setTrips(updatedTrips)
        localStorage.setItem('trips', JSON.stringify(updatedTrips))
    }

    const removeRestaurant = (tripId, restaurantId) => {
        const updatedTrips = trips.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    restaurants: trip.restaurants.filter(r => r.id !== restaurantId)
                }
            }
            return trip
        })
        setTrips(updatedTrips)
        localStorage.setItem('trips', JSON.stringify(updatedTrips))
    }

    // 💡 If you load mock data, load it here!

    const contextValue = {
        trips,
        setTrips,
        addTrip,
        removeTrip,
        addAttraction,
        removeAttraction,
        addRestaurant,
        removeRestaurant
    }

    return (
        <TripsContext.Provider value={contextValue}>
            {children}
        </TripsContext.Provider>
    )
}

export { TripsContext } // Export the context itself for use in components
