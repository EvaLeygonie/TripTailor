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
import { createPortal } from "react-dom";

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
  const anchorInputRef = useRef(null);
  // const panelInputRef = useRef(null);
  const cardRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false); // NEW: State for feedback message

  // Effect to determine if device is mobile
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
    };
  }, []);

  // NEW: Effect to hide the feedback message after 2 seconds
  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => {
        setShowFeedback(false);
      }, 2000); // Hide after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);


  const isPlanned = !!item.planning && item.planning.trim().length > 0;

  const getCategoryIcon = (category) => {
    if (!category) return MapPin;
    switch ((category || "").toLowerCase()) {
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

  const handleDateClick = (e) => {
    e.stopPropagation();
    if (isMobile) {
      cardRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }

    // Since panelInputRef is not being rendered, we only use anchorInputRef
    const el = anchorInputRef.current;
    if (!el) return;

    if (el.showPicker) el.showPicker();
    else {
      el.focus();
      el.click();
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    onPlan?.(item.id, newDate);
  };

  // NEW: Handler for the must-see button click, including feedback logic
  const handleToggleMustSee = (e) => {
    e.stopPropagation();

    const wasMustSee = isMustSee;
    onToggleFavorite();

    // Show feedback only if we are ADDING it to Must-Sees
    if (!wasMustSee) {
        setShowFeedback(true);
    }
  };


  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col bg-white rounded-xl shadow-lg overflow-visible transition-all duration-300 ease-in-out ${
        isExpanded ? "shadow-xl" : "hover:shadow-xl"
      }`}
    >
      {/* --- Card Header --- */}
      <div className="flex p-3 sm:p-4">
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

        <div className="flex-grow flex flex-col justify-between">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 text-left">
            {item.title}
          </h3>

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

          {/* Actions */}
          <div className="mt-2 flex space-x-2">
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 rounded-full border border-transparent text-red-600 hover:bg-red-100 hover:border-red-500 transition"
                title="Delete Item"
              >
                <Trash2 size={18} />
              </button>
            )}

            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1 rounded-full border border-transparent text-blue-600 hover:bg-blue-100 hover:border-blue-500 transition"
                title="Edit Item"
              >
                <Edit size={18} />
              </button>
            )}

            {/* Calendar */}
            <button
              onClick={handleDateClick}
              className={`p-1 rounded-full border border-transparent transition ${
                isPlanned
                  ? "text-violet-600 hover:bg-violet-100 hover:border-violet-600"
                  : "text-violet-400 hover:bg-violet-100 hover:border-violet-400"
              }`}
              title={isPlanned ? `Planned for ${item.planning}` : "Plan Item"}
            >
              {isPlanned ? <CalendarCheck size={18} /> : <Calendar size={18} />}
            </button>

            {/* Must-See Button & Feedback */}
            <div className="relative flex items-center">
                <button
                onClick={handleToggleMustSee} // Use the new handler
                className={`p-1 rounded-full border border-transparent transition ${
                    isMustSee
                    ? "text-yellow-500 hover:text-yellow-600 hover:border-yellow-500"
                    : "text-gray-400 hover:text-yellow-400 hover:bg-gray-100 hover:border-gray-400"
                }`}
                title={isMustSee ? "Remove from Must-See" : "Add to Must-See"}
                >
                <Star size={18} fill={isMustSee ? "currentColor" : "none"} />
                </button>

                {/* Feedback Message */}
                <span
                    className={`absolute left-full ml-2 whitespace-nowrap text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full transition-all duration-300 pointer-events-none ${
                        showFeedback ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}
                >
                    Added to Must-sees!
                </span>
            </div>
          </div>
        </div>
      </div>

      {isMobile ? (
        createPortal(
          <div
            className="
                fixed
                inset-x-[max(16px,env(safe-area-inset-left))]
                bottom-[max(12px,env(safe-area-inset-bottom))]
                z-[9999]
                flex justify-center pointer-events-none
              "
            aria-hidden="true"
          >
            <input
              ref={anchorInputRef}
              type="date"
              value={item.planning || ""}
              min={tripStartDate}
              max={tripEndDate}
              onChange={handleDateChange}
              className="
                  opacity-0
                  w-[min(320px,calc(100vw-32px))]
                  h-[44px]
                "
              tabIndex={-1}
            />
          </div>,
          document.body
        )
      ) : (
        <div
          className="sm:absolute sm:left-1/2 sm:top-[98%] sm:-translate-x-1/2 z-[70] pointer-events-none"
          aria-hidden="true"
        >
          <input
            ref={anchorInputRef}
            type="date"
            value={item.planning || ""}
            min={tripStartDate}
            max={tripEndDate}
            onChange={handleDateChange}
            className="opacity-0 w-[280px] h-[44px]"
            tabIndex={-1}
          />
        </div>
      )}

      {/* --- Expandable Content (children) --- */}
      {children && (
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded
              ? "max-h-[1000px] opacity-100 border-t border-gray-100"
              : "max-h-0 opacity-0"
          }`}
        >
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
          className={`w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-500 transition flex justify-center items-center ${
            isExpanded ? "border-t border-gray-200" : ""
          }`}
          title={isExpanded ? "Collapse Details" : "Show Details"}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      )}
    </div>
  );
};

export default ListItem;
