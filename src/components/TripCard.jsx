export default function TripCard({ trip, onClick }) {
  const { title, destination, dates, coverImage, tripStatus, } = trip;

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
    className="cursor-pointer overflow-hidden rounded-xl shadow-md transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-white max-w-sm w-full">
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
      

      <div className="p-4 space-y-1">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600">
          {destination.city}, {destination.country}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(dates.start).toLocaleDateString()} –{" "}
          {new Date(dates.end).toLocaleDateString()}
        </p>
      </div>

      {/*<Link to={`/trip/${trip.id}`}
      className="mt-4 inline-block text-center bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">

        View Details
      </Link>*/}
    </article>
  );
}
