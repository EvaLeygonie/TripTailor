export default function TripCard({ trip }) {
  const { title, destination, dates, coverImage } = trip;

  return (
    <article className="trip-card-content">
      <img
        src={coverImage}
        alt={title}
        className="trip-card-image"
      />
      <div className="trip-card-info">
        <h2>{title}</h2>
        <p>
          {destination.city}, {destination.country}
        </p>
        <p>
          {new Date(dates.start).toLocaleDateString()} –{" "}
          {new Date(dates.end).toLocaleDateString()}
        </p>
      </div>
    </article>
  );
}
