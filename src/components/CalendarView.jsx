import { useState, useEffect } from "react"

export default function CalendarView({ trip }) {
  const [days, setDays] = useState([])

  useEffect(() => {
    if (!trip) return

    const { start, end } = trip.dates
    const tempDays = []
    for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
      tempDays.push({ date: d.toISOString().split("T")[0] })
    }
    setDays(tempDays)
  }, [trip])

  if (!trip) return null

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold pb-8">Planned activities</h1>
      <p className="text-gray-600 mb-4">
        {trip.dates.start} – {trip.dates.end}
      </p>

      {days.map((day) => {
        const dateFormatted = new Date(day.date).toLocaleDateString("en", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })

        return (
          <div key={day.date} className="mb-4 border-b pb-2">
            <h2 className="font-semibold text-lg">{dateFormatted}</h2>
          </div>
        )
      })}
    </div>
  )
}
