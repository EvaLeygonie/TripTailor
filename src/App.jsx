import './App.css'
import { BrowserRouter as Router } from "react-router-dom"
import AppRouter from "./router/AppRouter"
import { TripsProvider } from "./context/TripsContext"

export default function App() {
  return (
    <Router>
      <TripsProvider>
        <div className="app">
          <main>
            <AppRouter />
          </main>
        </div>
      </TripsProvider>
    </Router>
  )
}
