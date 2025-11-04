// TripsContext.jsx
import { createContext, useState } from 'react'

const TripsContext = createContext({
  trips: [], // Use an array for trips
  setTrips: () => {}
})

export function TripsProvider({ children }) {
    // Add state for your trips here, for now it can be an empty array
    const [trips, setTrips] = useState([])

    // 💡 If you load mock data, load it here!
    // const [trips, setTrips] = useState(mockTrips)

    const contextValue = {
        trips,
        setTrips,
    }

    return (
        <TripsContext.Provider value={contextValue}>
            {children}
        </TripsContext.Provider>
    )
}

export default TripsContext // Export the context itself for use in components
