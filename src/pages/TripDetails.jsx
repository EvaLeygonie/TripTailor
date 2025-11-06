import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft } from "lucide-react";
import TabNav from "../components/TabNav";
import MustSeesList from "../components/MustSeesList";
import AttractionsList from "../components/AttractionsList";
import RestaurantsList from "../components/RestaurantsList";
import PackingList from "../components/PackingList";
import BudgetView from "../components/BudgetView";
import trips from "../data/mockTrips";
import { TripsContext } from "../context/TripsContext";

export default function TripDetails() {
  const [activeTab, setActiveTab] = useState("mustsees");
  const navigate = useNavigate();
  const { id } = useParams();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRemoveButton, setShowRemoveButton] = useState(true);

  const { trips: contextTrips, removeTrip } = useContext(TripsContext);
  const allTrips = [...trips, ...contextTrips];
  const trip = allTrips.find((t) => t.id === id);

  const handleRemoveClick = () => {
    setShowConfirmation(true);
    setShowRemoveButton(false);
  };

  const handleConfirm = () => {
    removeTrip(id);
    setShowConfirmation(false);
    navigate("/");
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setShowRemoveButton(true);
  };

  if (!trip) {
    return (
      <div className="p-8 text-center text-red-600">
        <h1 className="text-3xl font-bold">404</h1>
        <p>Trip not found! Please check the URL.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 flex items-center gap-3 p-3 sm:p-4 bg-white border-b border-gray-200 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">{trip.title}</h2>
          <p className="text-gray-600 flex items-center gap-1 text-sm sm:text-base">
            <MapPin size={14} className="text-gray-500" />
            {trip.destination.city}, {trip.destination.country}
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-[64px] z-10">
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto p-3 sm:p-6">
        {activeTab === "mustsees" && <MustSeesList trip={trip} />}
        {activeTab === "attractions" && <AttractionsList trip={trip} />}
        {activeTab === "restaurants" && <RestaurantsList trip={trip} />}
        {activeTab === "packing" && <PackingList trip={trip} />}
        {activeTab === "budget" && <BudgetView trip={trip} />}
      </div>

      {/* Remove Button */}
      {showRemoveButton && (
        <div className="p-4 bg-white border-t border-gray-200">
          <button
            onClick={handleRemoveClick}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 active:scale-[0.97] transition-all"
          >
            Remove Trip
          </button>
        </div>
      )}

      {/* Confirmation Box */}
      {showConfirmation && (
        <div className="p-5 bg-white border-t border-gray-200">
          <p className="text-center mb-4 text-gray-700 font-medium">
            Are you sure you want to delete this trip?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="w-full sm:w-auto bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
              onClick={handleConfirm}
            >
              Yes
            </button>
            <button
              className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] sm:static sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
              onClick={handleCancel}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
