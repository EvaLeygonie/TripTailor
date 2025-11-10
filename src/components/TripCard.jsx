import { Calendar, MapPin, DollarSign, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

export default function TripCard({ trip, onEdit }) {
  const {
    title = "No title",
    destination = { city: "-", country: "-" },
    dates = { start: "", end: "" },
    coverImage = "",
    tripStatus = "planned",
    budget = { total: 0, breakdown: {} },
  } = trip;

  if (!trip) return null;

  // Add SEK formatter
  const moneySEK = (n) =>
    (n ?? 0).toLocaleString("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    });

  const spent = Array.isArray(budget?.expenses)
    ? budget.expenses
        .filter((e) => e?.isPaid)
        .reduce((sum, e) => sum + Number(e?.amount || 0), 0)
    : Object.values(budget?.breakdown || {}).reduce(
        (sum, n) => sum + Number(n || 0),
        0
      );

  const total = budget?.total ?? 0;
  const budgetPercentage = total > 0 ? (spent / total) * 100 : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "planned":
        return "bg-blue-500";
      case "ongoing":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <article className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 max-w-sm w-full bg-white">
      {/* Cover + Link */}
      <Link to={`/trip/${trip.id}`} className="block h-48 w-full relative">
        <img
          src={coverImage}
          alt={title}
          className="h-full w-full object-cover"
        />

        <span
          className={`absolute top-3 right-3 text-xs text-white px-3 py-1 rounded-full ${getStatusColor(
            tripStatus
          )}`}
        >
          {tripStatus.charAt(0).toUpperCase() + tripStatus.slice(1)}
        </span>
      </Link>

      {/* Edit button (separat, ligger ovanpå men utanför Link) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Viktigt för att förhindra navigation
          onEdit(trip);
        }}
        className="absolute top-3 left-3 z-10 bg-white/80 hover:bg-white text-purple-700 rounded-full p-2 shadow-md transition"
      >
        <Pencil size={16} />
      </button>

      {/* Info */}
      <div className="p-4 flex flex-col justify-between space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin size={14} />
            <span>
              {destination.city}, {destination.country}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar size={14} />
            <span>
              {new Date(dates.start).toLocaleDateString()} –{" "}
              {new Date(dates.end).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-sm mb-1">
            <div className="flex items-center gap-1 text-gray-600">
              <DollarSign size={14} />
              <span>Budget</span>
            </div>
            <span className="font-medium text-gray-800">
              {moneySEK(spent)} / {moneySEK(total)}
            </span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                budgetPercentage > 100
                  ? "bg-red-500"
                  : budgetPercentage > 80
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
