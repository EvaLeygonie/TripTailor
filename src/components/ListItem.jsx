import {
  Star,
  Edit,
  Calendar,
  CalendarCheck,
  Trash2,
  MapPin,
  Soup,
  TreePine,
  Landmark,
  Camera,
  Bath,
  Coffee,
  Drama,
  Amphora,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

const ListItem = ({
  item,
  type,
  isMustSee,
  onToggleFavorite,
  onEdit,
  onDelete,
  onToggleExpand,
  isExpanded,
  children,
  onPlan,
  tripStartDate,
  tripEndDate,
  hideRating = false,
}) => {
  const [centerPicker, setCenterPicker] = useState(false);
  const centerInputRef = useRef(null);

  useEffect(() => {
    if (!centerPicker) return;
    const el = centerInputRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    if (el.showPicker) {
      requestAnimationFrame(() => el.showPicker());
    } else {
      // empty
    }
  }, [centerPicker]);

  const isPlanned = !!item.planning && item.planning.trim().length > 0;

  const getCategoryIcon = (category) => {
    if (!category) return MapPin;

    switch (category.toLowerCase()) {
      case "nature":
        return TreePine;
      case "landmark":
      case "historical site":
        return Landmark;
      case "museum":
      case "art gallery":
        return Amphora;
      case "sightseeing":
        return Camera;
      case "entertainment":
      case "theme park":
        return Drama;
      case "café / bakery":
      case "restaurant":
        return Coffee;
      case "park":
      case "beach":
      case "religious site":
      case "relaxation":
        return Bath;
      default:
        return Soup;
    }
  };

  const Icon = getCategoryIcon(item.category);

  return (
    <div
      className={`relative flex flex-col bg-white rounded-xl shadow-lg transition-all duration-300 ease-in-out
      ${isExpanded ? "shadow-xl" : "hover:shadow-xl"}
      ${centerPicker ? "overflow-visible" : "overflow-hidden"}
    `}
    >
      {/* --- Card Header (Row of Image + Content) --- */}
      <div className="flex p-3 sm:p-4">
        {/* Image */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 mr-4">
          <img
            src={
              item.image ||
              "https://placehold.co/128x128/eeeeee/333333?text=Travel"
            }
            alt={item.title}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/128x128/eeeeee/333333?text=${
                type === "category" ? "Landmark" : "Nature"
              }`;
            }}
          />
        </div>

        {/* Content & Main Info */}
        <div className="flex-grow flex flex-col justify-between">
          {/* FIX: Enforce text-left on the title element */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 text-left">
            {item.title}
          </h3>

          {/* Sub-Info Row */}
          <div className="text-sm text-gray-500 mt-0.5">
            <div className="flex items-center">
              <Icon
                size={14}
                className="mr-1.5 flex-shrink-0 text-indigo-500"
              />
              <span>
                {item.category ||
                  (type === "attraction" ? "Sightseeing" : "Dining")}
              </span>
              {!hideRating && item?.rating != null && item?.rating !== "" && (
                <>
                  <span className="mx-2">•</span>
                  <span className="flex items-center text-yellow-600 font-medium">
                    <Star size={14} fill="currentColor" className="mr-1" />
                    {Number(item.rating).toFixed(1)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="mt-2 flex space-x-2">
            {/* Delete Button */}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 rounded-full border border-transparent text-gray-600 hover:text-red-500 hover:border-red-500 transition duration-150"
                title="Delete Item"
              >
                <Trash2 size={18} />
              </button>
            )}

            {/* Edit Button */}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1 rounded-full border border-transparent text-gray-600 hover:text-blue-500 transition duration-150"
                title="Edit Item"
              >
                <Edit size={18} />
              </button>
            )}

            <div className="relative inline-flex overflow-visible z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCenterPicker(true);
                }}
                className={`p-1 rounded-full border border-transparent transition duration-150 ${
                  isPlanned
                    ? "text-purple-600 hover:text-violet-600"
                    : "text-gray-600 hover:text-violet-600"
                }`}
                title={isPlanned ? `Planned for ${item.planning}` : "Plan Item"}
              >
                {isPlanned ? (
                  <CalendarCheck size={18} />
                ) : (
                  <Calendar size={18} />
                )}
              </button>
            </div>

            {/* Must-See Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`p-1 rounded-full border border-transparent transition duration-150 ${
                isMustSee
                  ? "text-yellow-500 hover:text-yellow-600 hover:border-yellow-500"
                  : "text-gray-400 hover:text-yellow-400 hover:border-gray-400"
              }`}
              title={isMustSee ? "Remove from Must-See" : "Add to Must-See"}
            >
              <Star size={18} fill={isMustSee ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>

      {/* --- Expandable Content (children) --- */}
      {children && (
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded
              ? "max-h-[1000px] opacity-100 border-t border-gray-100"
              : "max-h-0 opacity-0"
          }`}
        >
          {/* Ensure children content is wrapped */}
          <div className="p-4 pt-3">{children}</div>
        </div>
      )}

      {/* --- Toggle Button --- */}
      {children && onToggleExpand && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className={`w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-500 transition-all duration-300 flex justify-center items-center ${
            isExpanded ? "border-t border-gray-200" : ""
          }`}
          title={isExpanded ? "Collapse Details" : "Show Details"}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      )}
      {/* Teleport input  */}
      {centerPicker && (
        <>
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setCenterPicker(false)}
            aria-hidden="true"
          />

          <div
            className="absolute left-1/2 top-full -translate-x-1/2 z-[70]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[300px] h-[44px] flex items-center justify-center">
              <input
                ref={centerInputRef}
                type="date"
                value={item.planning || ""}
                min={tripStartDate}
                max={tripEndDate}
                onChange={(e) => {
                  onPlan?.(item.id, e.target.value);
                  setCenterPicker(false);
                }}
                onBlur={() => {
                  setTimeout(() => setCenterPicker(false), 120);
                }}
                className="opacity-0 w-full h-full cursor-pointer"
                autoFocus
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListItem;
