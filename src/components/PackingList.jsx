import { Plus, Edit, Trash2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { trips } from '../data/mockTrips.jsx'

export default function PackingList() {
  const { id } = useParams()
  const trip = trips.find(t => t.id === id)
  if (!trip) return <div className="p-4 text-center text-gray-500">Loading trip data...</div>

  const handleAddClick = () => console.log("Add item")
  const handleEdit = (cat, label) => console.log(`Edit ${label} in ${cat}`)
  const handleDelete = (cat, label) => console.log(`Delete ${label} in ${cat}`)
  const handleToggleCheck = (cat, label) => console.log(`Toggle ${label} in ${cat}`)

  const allItems = trip.packingList.flatMap(cat => cat.items)
  const totalItems = allItems.length
  const checkedItems = 0
  const progressPercentage = totalItems ? (checkedItems / totalItems) * 100 : 0

  return (
    <section className="px-4 sm:px-6 py-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Packing List</h2>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 active:scale-[0.97] transition-all"
        >
          <Plus size={20} />
          <span>Add Item</span>
        </button>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">{checkedItems} / {totalItems} items packed</p>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all" style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>

      <div className="space-y-6">
        {trip.packingList.map(cat => (
          <div key={cat.category} className="bg-white rounded-xl shadow p-4 sm:p-5">
            <h3 className="text-xl font-semibold mb-3 border-b pb-2">{cat.category}</h3>
            <ul className="space-y-3">
              {cat.items.map(item => (
                <li key={item.label} className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 border-gray-300 rounded" checked={item.checked || false} onChange={() => handleToggleCheck(cat.category, item.label)} />
                    <span className="text-gray-800 font-medium">{item.label}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(cat.category, item.label)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full transition"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(cat.category, item.label)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition"><Trash2 size={16} /></button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {totalItems === 0 && (
        <div className="text-center py-10 text-gray-500 italic">Your packing list is empty. Start adding items!</div>
      )}
    </section>
  )
}
