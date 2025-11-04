// import { useParams } from "react-router-dom"
// import { useContext } from "react"
// import { TripsContext } from "../context/TripsContext"

export default function Header({ isTripPage }) {
  // const { id } = useParams();
  // const { trips } = useContext(TripsContext);
  // const trip = trips.find((t) => t.id === id);

  return (
    <header className="header">
      {!isTripPage ? (
        <h1>TripTailor</h1>
      ) : (
        <div className="trip-header">
          {/* <h2>{trip?.name || "Resa"}</h2>
          <p>{trip?.destination || ""}</p> */}
          <h1>Resa Info</h1>
        </div>
      )}
    </header>
  )
}
