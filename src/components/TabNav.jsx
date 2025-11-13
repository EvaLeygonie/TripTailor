export default function TabNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "mustsees", label: "Must-Sees" },
    { id: "attractions", label: "Attractions" },
    { id: "restaurants", label: "Restaurants" },
    { id: "packing", label: "Packing" },
    { id: "budget", label: "Budget" },
    { id: "planning", label: "Planning" },
  ];

  return (
    <nav
      className="
        flex justify-between sm:justify-center flex-wrap 
        gap-1 sm:gap-3 md:gap-4 
        px-2 sm:px-4 py-2
         bg-white
        sticky top-[64px] sm:top-[70px] z-20
        transition-none w-full
      "
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            flex-shrink-0 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-all duration-150
            rounded-md
            ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-fuchsia-900 to-blue-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-violet-100 hover:text-violet-700"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}


