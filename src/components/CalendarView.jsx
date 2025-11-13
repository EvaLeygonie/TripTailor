import { useState, useContext, useEffect } from "react";
import { Plus, X } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { TripsContext } from "../context/TripsContext";

export default function CalendarView({ trip }) {
  const { trips, setTrips, clearAttractionPlanning, clearRestaurantPlanning, editAttraction, editRestaurant } = useContext(TripsContext);
  const currentTrip = trips.find(t => t.id === trip?.id);

  const [selectedDay, setSelectedDay] = useState(null);
  const [activities, setActivities] = useState([]);
  const [availableActivities, setAvailableActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  // State för mobil / desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!currentTrip || !currentTrip.dates) return;

    const plannedAttractions = (currentTrip.attractions || [])
      .filter(a => a.planning?.trim())
      .map(a => ({ ...a, name: a.title, type: "Attraction", time: a.time || "", endTime: a.endTime || "" }));

    const plannedRestaurants = (currentTrip.restaurants || [])
      .filter(r => r.planning?.trim())
      .map(r => ({ ...r, name: r.title, type: "Restaurant", time: r.time || "", endTime: r.endTime || "" }));

    const allPlanned = [...plannedAttractions, ...plannedRestaurants];
    const saved = JSON.parse(localStorage.getItem(`activities_${currentTrip.id}`) || "[]");
    const mergedActivities = [...allPlanned, ...saved.filter(s => !allPlanned.some(a => a.id === s.id))];

    setActivities(mergedActivities.filter(a => a.planning?.trim()));

    const allAvailable = [
      ...(currentTrip.attractions || []).map(a => ({ ...a, name: a.title, type: "Attraction" })),
      ...(currentTrip.restaurants || []).map(r => ({ ...r, name: r.title, type: "Restaurant" })),
    ];
    setAvailableActivities(allAvailable);
  }, [currentTrip]);

  if (!currentTrip) return null;

  const handleDayClick = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    setSelectedDay(`${year}-${month}-${day}`);
    setSelectedActivity("");
  };

  const handleOpenModal = () => {
    if (!selectedDay) setSelectedDay(new Date().toISOString().split("T")[0]);
    setShowModal(true);
  };

  const handleAddActivity = () => {
    if (!selectedActivity || !selectedDay) return;
    const activityData = availableActivities.find(a => a.name === selectedActivity);
    if (!activityData) return;

    const newActivity = { ...activityData, planning: selectedDay };
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    localStorage.setItem(`activities_${currentTrip.id}`, JSON.stringify(updatedActivities));

    if (activityData.type === "Attraction") editAttraction(currentTrip.id, activityData.id, { planning: selectedDay });
    else editRestaurant(currentTrip.id, activityData.id, { planning: selectedDay });

    setTrips(trips.map(t =>
      t.id === currentTrip.id
        ? {
            ...t,
            attractions: t.attractions.map(a => a.id === activityData.id ? { ...a, planning: selectedDay } : a),
            restaurants: t.restaurants.map(r => r.id === activityData.id ? { ...r, planning: selectedDay } : r),
            activities: updatedActivities
          }
        : t
    ));

    setShowModal(false);
  };

  const handleDeleteClick = (activity) => { setActivityToDelete(activity); setShowDeleteModal(true); };
  const confirmDeleteActivity = () => {
    if (!activityToDelete) return;
    if (activityToDelete.type === "Attraction") clearAttractionPlanning(currentTrip.id, activityToDelete.id);
    else clearRestaurantPlanning(currentTrip.id, activityToDelete.id);

    setActivities(prev => prev.filter(a => a.id !== activityToDelete.id));
    setActivityToDelete(null);
    setShowDeleteModal(false);
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
      const hasActivity = activities.some(a => a.planning === dateStr);
      if (hasActivity) return <div className="w-2 h-2 bg-violet-600 rounded-full mx-auto mt-1"></div>;
    }
    return null;
  };

  const selectedDayActivities = activities
    .filter(a => a.planning === selectedDay)
    .sort((a, b) => (!a.time ? 1 : !b.time ? -1 : a.time.localeCompare(b.time)));

  return (
    <div className="p-1 sm:p-6 bg-gray-50 rounded-xl shadow-lg mt-6 max-w-full overflow-x-hidden">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Planned activities</h2>
          <p className="text-gray-600 text-sm">{currentTrip.dates.start} – {currentTrip.dates.end}</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-gray-50 text-violet-600 flex items-center justify-center p-2 rounded-md border hover:bg-violet-50 hover:text-violet-700 transition-all duration-200 ease-in-out"
        >
          <Plus size={30} strokeWidth={3} className="text-fuchsia-900 transition duration-200" />
        </button>
      </div>

      <div className="w-full px-2 py-2 overflow-x-hidden flex justify-center">
        <div className="w-full max-w-[100%] sm:max-w-[700px]">
          <Calendar
            className="bg-white rounded-xl shadow-lg w-full"
            minDate={new Date(currentTrip.dates.start)}
            maxDate={new Date(currentTrip.dates.end)}
            onClickDay={handleDayClick}
            tileContent={tileContent}
            value={selectedDay ? new Date(selectedDay) : null}
            activeStartDate={new Date(currentTrip.dates.start)}
            formatMonth={(locale, date) => isMobile
              ? date.toLocaleString("sv-SE", { month: "short" })  // "nov"
              : date.toLocaleString("sv-SE", { month: "long" })   // "november"
            }
          />
        </div>
      </div>

      {selectedDay && (
        <div className="mt-4">
          <h3 className="text-base font-semibold text-left mt-6 mb-4">
            Activities planned on {new Date(selectedDay).toLocaleDateString()}
          </h3>

          {selectedDayActivities.length > 0 ? (
            <ul className="space-y-3">
              {selectedDayActivities.map(a => (
                <li key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-2 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    {a.image && <img src={a.image} alt={a.name} className="w-10 h-10 object-cover rounded-md" />}
                    <div>
                      <span className="font-medium">{a.name}</span>
                      <span className="text-xs text-gray-400 ml-1">({a.type})</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteClick(a)} className="bg-gray-50 text-red-500 hover:text-red-700 rounded-md p-1">
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No activities planned</p>
          )}
        </div>
      )}

      {/* Add Activity Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-5 overflow-y-auto max-h-[90vh] relative">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Add activity</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" value={selectedDay || ""} min={currentTrip.dates.start} max={currentTrip.dates.end} onChange={(e)=>setSelectedDay(e.target.value)} className="border rounded-md w-full p-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Choose activity</label>
                <select value={selectedActivity} onChange={(e)=>setSelectedActivity(e.target.value)} className="border rounded-md w-full p-2">
                  <option value="">Select...</option>
                  {availableActivities.map(a => <option key={a.id} value={a.name}>{a.name} ({a.type})</option>)}
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={()=>setShowModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">Cancel</button>
                <button onClick={handleAddActivity} className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-5 text-center">
            <p className="mb-4">Are you sure you want to delete this activity?</p>
            <div className="flex justify-center gap-3">
              <button onClick={confirmDeleteActivity} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Yes</button>
              <button onClick={()=>setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
