import './App.css'
import { BrowserRouter as Router, useLocation } from "react-router-dom"
import AppRouter from "./router/AppRouter"
import Header from "./components/Header"
import { TripsProvider } from "./context/TripsContext"

//Test new repo

function Layout() {
  const location = useLocation()
  const isTripPage = location.pathname.startsWith("/trip/")

  return (
    <div className="app">
      <Header isTripPage={isTripPage} />
      <main>
        <AppRouter />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <TripsProvider>
        <Layout />
      </TripsProvider>
    </Router>
  )
}
