

import { useState, useContext, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { TripsContext } from "../context/TripsContext"

export default function CalendarView({ trip }) {
  const { trips, setTrips, clearAttractionPlanning, clearRestaurantPlanning, editAttraction, editRestaurant } = useContext(TripsContext)

  const currentTrip = trips.find(t => t.id === trip?.id)

  const [days, setDays] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState("")
  const [availableActivities, setAvailableActivities] = useState([])
  const [activities, setActivities] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState(null)

  useEffect(() => {
    if (!currentTrip || !currentTrip.dates) return

    const { start, end } = currentTrip.dates;
    const tempDays = [];
    for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
      tempDays.push({ date: d.toISOString().split("T")[0] });
    }
    setDays(tempDays)

    const plannedAttractions = (currentTrip.attractions || [])
      .filter(a => a.planning?.trim())
      .map(a => ({ ...a, name: a.title, type: "Attraction", time: a.time || "", endTime: a.endTime || "" }))

    const plannedRestaurants = (currentTrip.restaurants || [])
      .filter(r => r.planning?.trim())
      .map(r => ({ ...r, name: r.title, type: "Restaurant", time: r.time || "", endTime: r.endTime || "" }))

    const allPlanned = [...plannedAttractions, ...plannedRestaurants]

    const saved = JSON.parse(localStorage.getItem(`activities_${currentTrip.id}`) || "[]")

    const mergedActivities = [
      ...allPlanned,
      ...saved.filter(s => !allPlanned.some(a => a.id === s.id))
    ]

    setActivities(mergedActivities.filter(a => a.planning?.trim()))

    const allAvailable = [
      ...(currentTrip.attractions || []).map(a => ({ ...a, name: a.title, type: "Attraction" })),
      ...(currentTrip.restaurants || []).map(r => ({ ...r, name: r.title, type: "Restaurant" })),
    ];
    setAvailableActivities(allAvailable)

  }, [currentTrip, currentTrip?.dates?.start, currentTrip?.dates?.end])


  if (!currentTrip) return null

  const handleOpenModal = (day) => {
    setSelectedDay(day)
    setShowModal(true)
    setSelectedActivity("")
  }

  const handleAddActivity = () => {
    if (!selectedActivity || !selectedDay) return

    const activityData = availableActivities.find(a => a.name === selectedActivity)
    if (!activityData) return;

    const newActivity = {
      ...activityData,
      planning: selectedDay.date,
    }

    const updatedActivities = [...activities, newActivity]
    setActivities(updatedActivities)
    localStorage.setItem(`activities_${currentTrip.id}`, JSON.stringify(updatedActivities))

    if (activityData.type === "Attraction") {
      editAttraction(currentTrip.id, activityData.id, { planning: selectedDay.date })
    } else if (activityData.type === "Restaurant") {
      editRestaurant(currentTrip.id, activityData.id, { planning: selectedDay.date })
    }

    setTrips(trips.map(t =>
      t.id === currentTrip.id
        ? {
          ...t, attractions: t.attractions.map(a =>
            a.id === activityData.id ? { ...a, planning: selectedDay.date } : a
          ),
          restaurants: t.restaurants.map(r =>
            r.id === activityData.id ? { ...r, planning: selectedDay.date } : r
          ),
          activities: updatedActivities
        }
        : t
    ))

    setShowModal(false)
  }

  const handleDeleteClick = (activity) => {
    setActivityToDelete(activity)
    setShowDeleteModal(true)
  }

  const confirmDeleteActivity = () => {
    if (!activityToDelete) return

    if (activityToDelete.type === "Attraction") {
      clearAttractionPlanning(currentTrip.id, activityToDelete.id)
    } else if (activityToDelete.type === "Restaurant") {
      clearRestaurantPlanning(currentTrip.id, activityToDelete.id)
    }

    setActivities(prev => prev.filter(a => a.id !== activityToDelete.id))
    setActivityToDelete(null)
    setShowDeleteModal(false)
  }

  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow-lg mt-6 relative">
      <div className="flex flex-col items-start mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Planned activities</h2>
        <p className="text-gray-600 mb-6">
          {currentTrip.dates.start} – {currentTrip.dates.end}
        </p>
      </div>

      <div className="space-y-4">
        {days.map(day => {
          const dateFormatted = new Date(day.date).toLocaleDateString("en", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })

          const dayActivities = activities
            .filter(a => a.planning === day.date)
            .sort((a, b) => (!a.time ? 1 : !b.time ? -1 : a.time.localeCompare(b.time)));

          return (
            <div key={day.date} className="mb-4 border-b pb-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">{dateFormatted}</h2>
                <button
                  onClick={() => handleOpenModal(day)}
                  className="bg-gray-50 text-violet-600 flex items-center justify-center p-2 rounded-md border hover:bg-violet-50 hover:text-violet-700 transition-all duration-200 ease-in-out"
                >
                  <Plus size={25} className="text-fuchsia-900 group-hover:text-white transition duration-200" />
                </button>
              </div>

              <ul className="mt-8 space-y-2">
                {dayActivities.map((a, i) => (
                  <li key={i} className="text-gray-700 flex items-center gap-2">
                    {(a.time || a.endTime) && (
                      <span className="text-sm text-gray-500">
                        {a.time}{a.endTime && ` – ${a.endTime}`}
                      </span>
                    )}
                    {a.image && <img src={a.image} alt={a.name} className="w-6 h-6 object-cover rounded-md" />}
                    <span>{a.name}</span>
                    <span className="text-xs text-gray-400">({a.type})</span>
                    <button onClick={() => handleDeleteClick(a)} className="bg-gray-50 text-red-500 hover:text-red-700">
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Add activity</h2>
            <p className="text-gray-500 mb-4">
              {selectedDay && new Date(selectedDay.date).toLocaleDateString("en", { weekday: "long", day: "numeric", month: "long" })}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Choose activity</label>
              <select
                className="border rounded-md w-full p-2"
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
              >
                <option value="">Select...</option>
                {availableActivities.map(a => (
                  <option key={a.id} value={a.name}>{a.name} ({a.type})</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={handleAddActivity} className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700">Add</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <p className="mb-6">Are you sure you want to delete this activity?</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDeleteActivity} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Yes</button>
              <button onClick={() => setShowDeleteModal(false)} className="bg-gradient-to-b from-violet-500 to-violet-700 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:from-violet-600 hover:to-violet-800 transition-all duration-200">No</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
