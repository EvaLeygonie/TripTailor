import { Routes, Route } from "react-router-dom"
import TripsList from "../pages/TripsList"
import TripDetails from "../pages/TripDetails"

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<TripsList />} />
      <Route path="/trip/:id" element={<TripDetails />} />
    </Routes>
  );
}
