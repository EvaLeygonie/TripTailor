import { Star, MapPin, Utensils, Briefcase, DollarSign } from 'lucide-react';

export default function TabNav({ activeTab, setActiveTab }) {
  const tabDefinitions = [
    { key: 'mustsees', label: 'Must-Sees', Icon: Star },
    { key: 'attractions', label: 'Attractions', Icon: MapPin },
    { key: 'restaurants', label: 'Restaurants', Icon: Utensils },
    { key: 'packing', label: 'Packing', Icon: Briefcase },
    { key: 'budget', label: 'Budget', Icon: DollarSign },
  ];

  return (
    <div className="tab-nav sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
      <nav className="flex overflow-x-auto whitespace-nowrap scrollbar-hide">
        {tabDefinitions.map(({ key, label, Icon }) => {
          const isActive = activeTab === key;
          console.log(Icon)

          const baseClasses = "flex items-center gap-2 p-3 text-sm font-semibold transition-colors duration-200 cursor-pointer border-b-2";
          const activeClasses = "text-blue-600 border-blue-600";
          const inactiveClasses = "text-gray-500 border-transparent hover:text-blue-500 hover:border-gray-300";

          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
