import { Star, Edit, Calendar, Trash2, MapPin, Soup, TreePine, Landmark, Camera, Bath, Coffee, Drama, Amphora } from 'lucide-react'

const ListItem = ({ item, type, isMustSee, onToggleFavorite, onEdit, onDelete }) => {

  const getCategoryIcon = (category) => {
    if (!category) return MapPin;

    switch (category.toLowerCase()) {
      case 'nature':
        return TreePine;
      case 'landmark':
        return Landmark;
      case 'museum':
        return Amphora;
      case 'sightseeing':
        return Camera;
      case 'entertainment':
        return Drama;
      case 'café / bakery':
      case 'restaurant':
        return Coffee;
      case 'relaxation':
        return Bath;
      default:
        return Soup;
    }
  };

  const Icon = getCategoryIcon(item.category);

  return (
    <div className="flex bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">

      <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
        <img
          src={item.image || 'https://placehold.co/128x128/eeeeee/333333?text=Travel'}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/128x128/eeeeee/333333?text=${type === 'category' ? 'Landmark' : 'Nature' }`;
          }}
        />
      </div>

      <div className="flex-grow p-3 sm:p-4 relative">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.title}</h3>

        <div className="flex items-center text-sm text-gray-500 mt-0.5">
          <Icon size={14} className="mr-1.5 flex-shrink-0" />
          <span>{item.category || (type === 'attraction' ? 'Sightseeing' : 'Dining')}</span>
          {item.rating && (
            <>
              <span className="mx-2">•</span>
              <span className="flex items-center text-yellow-500 font-medium">
                <Star size={14} fill="currentColor" className="mr-1" />
                {item.rating.toFixed(1)}
              </span>
            </>
          )}
        </div>

        <div className="mt-2 flex space-x-2">
          {onDelete && <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded-full text-red-600 hover:bg-red-100 transition duration-150"
            title="Delete Item"
          >
            <Trash2 size={18} />
          </button>
        }

          {onEdit && <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 rounded-full text-blue-600 hover:bg-blue-100 transition duration-150"
            title="Edit Item"
          >
            <Edit size={18} />
          </button>
        }

        {/* Planning Button: Add function */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              //ADD PLANNING FUNCTIONALITY HERE
            }}
            className="p-1 rounded-full text-violet-500 hover:bg-violet-700 transition duration-150"
            title="Plan Item"
          >
            <Calendar size={18} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`p-1 rounded-full transition duration-150 ${isMustSee ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-400'}`}
            title={isMustSee ? "Remove from Must-See" : "Add to Must-See"}
          >
            {isMustSee ? <Star size={18} fill="currentColor" /> : <Star size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
