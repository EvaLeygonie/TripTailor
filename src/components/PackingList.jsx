import { Plus, Edit, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { trips } from "../data/mockTrips.jsx";

export default function PackingList() {
  const { id } = useParams();
  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        Loading trip data or trip ID not found in URL.
      </div>
    );
  }

  // Placeholder functions
  const handleAddClick = () => console.log("Add item");
  const handleEdit = (category, itemLabel) =>
    console.log(`Edit clicked for: ${itemLabel} in ${category}`);
  const handleDelete = (category, itemLabel) =>
    console.log(`Delete clicked for: ${itemLabel} in ${category}`);
  const handleToggleCheck = (category, itemLabel) =>
    console.log(`Toggle clicked for: ${itemLabel} in ${category}`);

  const allItems = trip.packingList.flatMap((category) => category.items);
  const totalItems = allItems.length;
  const checkedItems = 0;
  const progressPercentage =
    totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Packing List
        </h2>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white font-medium text-sm sm:text-base px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 active:scale-[0.97] transition"
        >
          <Plus size={18} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{checkedItems} / {totalItems} packed</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Category groups */}
      <div className="space-y-6">
        {trip.packingList.map((categoryGroup) => (
          <article
            key={categoryGroup.category}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
          >
            <header className="border-b px-4 py-3 bg-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                {categoryGroup.category}
              </h3>
            </header>

            <ul className="divide-y">
              {categoryGroup.items.map((item) => (
                <li
                  key={item.label}
                  className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  {/* Left side */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.checked || false}
                      onChange={() =>
                        handleToggleCheck(categoryGroup.category, item.label)
                      }
                      id={`item-${item.label.replace(/\s/g, "-")}`}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`item-${item.label.replace(/\s/g, "-")}`}
                      className="text-gray-800 text-sm sm:text-base cursor-pointer"
                    >
                      {item.label}
                    </label>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleEdit(categoryGroup.category, item.label)
                      }
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full transition"
                      title="Edit Item"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(categoryGroup.category, item.label)
                      }
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition"
                      title="Delete Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {/* Empty state */}
      {totalItems === 0 && (
        <div className="text-center py-10 text-gray-500 italic text-sm">
          Your packing list is empty. Start adding items!
        </div>
      )}
    </section>
  );
}
