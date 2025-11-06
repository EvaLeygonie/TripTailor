import { Plus, Edit, Trash2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { trips } from '../data/mockTrips.jsx'

export default function PackingList() {
  const { id } = useParams()
  const trip = trips.find((t) => t.id === id)

  if (!trip) {
    return <div className="p-4 text-center text-gray-500">Loading trip data or trip ID not found in URL.</div>
  }

  // Placeholder functions (inert for now)
  const handleAddClick = () => {
    console.log("Add item")
  }
  const handleEdit = (category, itemLabel) => console.log(`Edit clicked for: ${itemLabel} in ${category}`)
  const handleDelete = (category, itemLabel) => console.log(`Delete clicked for: ${itemLabel} in ${category}`)
  // Placeholder for checklist toggle (functionality to be added later)
  const handleToggleCheck = (category, itemLabel) => console.log(`Toggle clicked for: ${itemLabel} in ${category}`)

  // --- Packing List Calculations (Simplified for structure) ---
  const allItems = trip.packingList.flatMap(category => category.items)
  const totalItems = allItems.length
  // Static check count for display purposes only
  const checkedItems = 0
  const progressPercentage = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0
  // ---

  return (
    <div>
      <div>
        <h2>Packing List</h2>
        <button
            onClick={handleAddClick} // Inert placeholder function
          >
            <Plus size={20} />
            <span>Add item</span>
          </button>
      </div>

      <div>
        <p>{checkedItems} / {totalItems} items packed</p>
        <div>
          {/* Inner bar represents completion */}
          <div
            style={{ width: `${progressPercentage}%` }}
          >
          </div>
        </div>
      </div>

      <div>
        {trip.packingList.map(categoryGroup => (
          <div key={categoryGroup.category}>
            <h3>{categoryGroup.category}</h3>

            <ul>
              {categoryGroup.items.map(item => (
                <li key={item.label}>
                  <div>
                    <input
                      type="checkbox"
                      // Static checked status for structure (can be dynamic later)
                      checked={item.checked || false}
                      onChange={() => handleToggleCheck(categoryGroup.category, item.label)}
                      id={`item-${item.label.replace(/\s/g, '-')}`}
                      className="item-checkbox"
                    />
                    <label
                      htmlFor={`item-${item.label.replace(/\s/g, '-')}`}
                      className="item-label"
                    >
                      {item.label}
                    </label>
                  </div>

                  <div>
                    <button onClick={() => handleEdit(categoryGroup.category, item.label)}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(categoryGroup.category, item.label)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {totalItems === 0 && (
        <div>
          <p>Your packing list is empty. Start adding items!</p>
        </div>
      )}
    </div>
  )
}
