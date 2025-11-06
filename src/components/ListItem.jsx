import { Star, Edit, Trash2, MapPin, Soup, TreePine, Landmark, Camera, Bath, Coffee, Drama, Amphora } from 'lucide-react'

const ListItem = ({ item, type, isMustSee, onToggleFavorite, onEdit, onDelete }) => {

  const getCategoryIcon = (category) => {
    if (!category) return MapPin;
    switch (category.toLowerCase()) {
      case 'nature': return TreePine;
      case 'landmark': return Landmark;
      case 'museum': return Amphora;
      case 'sightseeing': return Camera;
      case 'entertainment': return Drama;
      case 'café / bakery':
      case 'restaurant': return Coffee;
      case 'relaxation': return Bath;
      default: return Soup;
    }
  };

  const Icon = getCategoryIcon(item.category);

  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
      <div className="w-full sm:w-24 sm:h-24 flex-shrink-0">
        <img
          src={item.image || 'https://placehold.co/128x128/eeeeee/333333?text=Travel'}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-grow p-3 sm:p-4 relative flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
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

        <div className="mt-2 flex gap-2">
          <button onClick={onEdit} className="p-2 sm:p-1 rounded-full text-blue-600 hover:bg-blue-100 transition">
            <Edit size={18} />
          </button>
          <button onClick={onDelete} className="p-2 sm:p-1 rounded-full text-red-600 hover:bg-red-100 transition">
            <Trash2 size={18} />
          </button>
          <button
            onClick={onToggleFavorite}
            className={`p-2 sm:p-1 rounded-full transition ${isMustSee ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-400'}`}
          >
            {isMustSee ? <Star size={18} fill="currentColor" /> : <Star size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
