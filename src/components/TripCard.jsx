import { Calendar, MapPin, DollarSign } from "lucide-react";

export default function TripCard({ trip, onClick }) {
  const {
    title = "No title",
    destination = { city: "-", country: "-" },
    dates = { start: "", end: "" },
    coverImage = "",
    tripStatus = "planned",
    budget = { total: 0, breakdown: {} },
  } = trip;

  if (!trip) return null;

  const spent =
    trip.tripStatus === "planned"
      ? 0
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
    <article
      onClick={onClick}
      className="cursor-pointer overflow-hidden rounded-xl shadow-md transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-white max-w-sm w-full"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="h-full w-full object-cover"
        />
        {/* Status tag */}
        <span
          className={`absolute top-3 right-3 text-xs text-white px-3 py-1 rounded-full ${getStatusColor(
            tripStatus
          )}`}
        >
          {tripStatus.charAt(0).toUpperCase() + tripStatus.slice(1)}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
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

        {/* Budget */}
        <div className="pt-2">
          <div className="flex justify-between items-center text-sm mb-1">
            <div className="flex items-center gap-1 text-gray-600">
              <DollarSign size={14} />
              <span>Budget</span>
            </div>
            <span className="font-medium text-gray-800">
              {Number(spent).toLocaleString()} /{" "}
              {Number(total).toLocaleString()} kr
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
      {/*<Link to={`/trip/${trip.id}`}
      className="mt-4 inline-block text-center bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">

        View Details
      </Link>*/}
    </article>
  );
}
