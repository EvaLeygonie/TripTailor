import { useState } from "react"
import TabNav from "../components/TabNav"
import MustSeesList from "../components/MustSeesList"
import AttractionsList from "../components/AttractionsList"
import RestaurantsList from "../components/RestaurantsList"
import PackingList from "../components/PackingList"
import BudgetView from "../components/BudgetView"

export default function TripDetails() {
  const [activeTab, setActiveTab] = useState("mustsees")

  return (
    <div className="trip-details">
      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tab-content">
        {activeTab === "mustsees" && <MustSeesList />}
        {activeTab === "attractions" && <AttractionsList />}
        {activeTab === "restaurants" && <RestaurantsList />}
        {activeTab === "packing" && <PackingList />}
        {activeTab === "budget" && <BudgetView />}
      </div>
    </div>
  )
}
