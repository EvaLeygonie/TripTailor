
import { Star } from 'lucide-react';

/**
 * ListItem Component
 * Renders a single, reusable card for an Attraction, Restaurant, or Must-See item.
 * This component is purely presentational and accepts data via props.
 *
 * @param {object} props
 * @param {object} props.item - The item object (attraction or restaurant).
 * @param {boolean} props.isMustSee - Indicates if the item is currently a favorite.
 * @param {function} props.onToggleFavorite - Placeholder for the function to toggle favorite status.
 * @param {string} props.type - 'attraction' or 'restaurant' (used for accessibility/future styling). => Maybe have slightly differen colors for each type so itäs clearer in must sees?
 */

export default function ListItem({ item, isMustSee = false, onToggleFavorite, type }) {
console.log(onToggleFavorite, type);

  return (
    <div
      key={item.id}
      className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
    >
      <div className="flex flex-col flex-grow min-w-0 pr-4">
        <h3 className="text-lg font-medium text-gray-900 truncate">
          {item.title}
        </h3>

        {/* Category and Rating */}
        <div className="flex items-center space-x-2 text-sm mt-1">
          <span className="text-gray-500 font-medium">{item.category}</span>
          <span className="text-gray-400">•</span>
          <div className="flex items-center text-amber-500">
            {/* Placeholder for Star Icon (Styling only) */}
            <Star size={14} fill="currentColor" className="mr-1" />
            <span className="text-gray-600">{item.rating}</span>
          </div>
        </div>
      </div>

      {/* Must-See Toggle (Right Side) */}
      <button
        // Button has no function yet
        aria-label={`Toggle favorite status for ${item.title}`}
        className="ml-4 p-2 transition duration-150 ease-in-out rounded-full"
      >
        <Star
          size={24}
          // Use isMustSee prop for initial display state
          className={isMustSee ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}
        />
      </button>
    </div>
  );
}
