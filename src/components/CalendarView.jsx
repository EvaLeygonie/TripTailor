

import { useState, useContext, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { TripsContext } from "../context/TripsContext"

export default function CalendarView({ trip }) {
  const { trips, setTrips } = useContext(TripsContext)

  const [days, setDays] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState("")
  const [time, setTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [availableActivities, setAvailableActivities] = useState([])
  const [activities, setActivities] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState(null)

  useEffect(() => {
    if (!trip) return

    const { start, end } = trip.dates
    const tempDays = []
    for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
      tempDays.push({ date: d.toISOString().split("T")[0] })
    }
    setDays(tempDays)

    const restaurantActivities = (trip.restaurants || []).map((r) => ({
      id: r.id,
      name: r.title,
      type: "Restaurant",
      image: r.image,
    }))
    const attractionActivities = (trip.attractions || []).map((a) => ({
      id: a.id,
      name: a.title,
      type: "Attraction",
      image: a.image,
    }))
    setAvailableActivities([...restaurantActivities, ...attractionActivities])

    const saved = JSON.parse(localStorage.getItem(`activities_${trip.id}`) || "[]")
    setActivities(saved.length ? saved : trip.activities || [])
  }, [trip])

  if (!trip) return null;

  const handleOpenModal = (day) => {
    setSelectedDay(day)
    setShowModal(true)
    setSelectedActivity("")
    setTime("")
    setEndTime("")
  }

  const handleAddActivity = () => {
    if (!selectedActivity || !selectedDay) return;

    const activityData = availableActivities.find((a) => a.name === selectedActivity)
    if (!activityData) return

    const newActivity = {
      ...activityData,
      day: selectedDay.date,
      time,
      endTime,
    }

    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities)

    localStorage.setItem(`activities_${trip.id}`, JSON.stringify(updatedActivities))

    setTrips(trips.map((t) => (t.id === trip.id ? { ...t, activities: updatedActivities } : t)))

    setShowModal(false)
  }


  const handleDeleteClick = (activity) => {
    setActivityToDelete(activity)
    setShowDeleteModal(true)
  }

  const confirmDeleteActivity = () => {
    if (!activityToDelete) return

    const updatedActivities = activities.filter((a) => a !== activityToDelete)
    setActivities(updatedActivities)

    localStorage.setItem(`activities_${trip.id}`, JSON.stringify(updatedActivities))
    setTrips(trips.map((t) => (t.id === trip.id ? { ...t, activities: updatedActivities } : t)))

    setActivityToDelete(null)
    setShowDeleteModal(false)
  }


  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow-lg mt-6 relative">
      <div className="flex flex-col items-start mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Planned activities</h2>
        <p className="text-gray-600 mb-6">
          {trip.dates.start} – {trip.dates.end}
        </p>
      </div>

      <div className="space-y-4">
        {days.map((day) => {
          const dateFormatted = new Date(day.date).toLocaleDateString("en", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })

          const dayActivities = activities.filter((a) => a.day === day.date)

          return (
            <div key={day.date} className="mb-4 border-b pb-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">{dateFormatted}</h2>
                <button
                  onClick={() => handleOpenModal(day)}
                  className="bg-gradient-to-b from-violet-500 to-violet-700 text-white flex items-center space-x-2 px-4 py-2 font-medium rounded-lg shadow-md hover:from-violet-600 hover:to-violet-800 transition-all duration-200 ease-in-out"
                >
                  <Plus size={20} />
                </button>
              </div>

              <ul className="mt-8 space-y-2">
                {dayActivities.map((a, i) => (
                  <li key={i} className="text-gray-700 flex items-center gap-2">
                    {(a.time || a.endTime) && (
                      <span className="text-sm text-gray-500">
                        {a.time}
                        {a.endTime && ` – ${a.endTime}`}
                      </span>
                    )}
                    {a.image && (
                      <img
                        src={a.image}
                        alt={a.name}
                        className="w-6 h-6 object-cover rounded-md"
                      />
                    )}
                    <span>{a.name}</span>
                    <span className="text-xs text-gray-400">({a.type})</span>
                    <button
                      onClick={() => handleDeleteClick(a)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Add activity</h2>
            <p className="text-gray-500 mb-4">
              {selectedDay &&
                new Date(selectedDay.date).toLocaleDateString("en", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Choose activity</label>
              <select
                className="border rounded-md w-full p-2"
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
              >
                <option value="">Select...</option>
                {availableActivities.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name} ({a.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Start time</label>
              <input
                type="time"
                className="border rounded-md w-full p-2"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">End time</label>
              <input
                type="time"
                className="border rounded-md w-full p-2"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddActivity}
                className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <p className="mb-6">Are you sure you want to delete this activity?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeleteActivity}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gradient-to-b from-violet-500 to-violet-700 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:from-violet-600 hover:to-violet-800 transition-all duration-200"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  )
}
