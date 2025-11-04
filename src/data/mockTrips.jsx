export const trips = [
  {
    id: "t_barcelona_weekend_2025_11",
    title: "Barcelona Weekend Getaway",
    status: "planned", // planned , ongoing, completed
    coverImage:
      "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1365",
    destination: { city: "Barcelona", country: "Spain" },
    dates: { start: "2025-11-21", end: "2025-11-24", nights: 3 },
    tabSections: [
      { key: "mustSees", label: "Must-Sees" },
      { key: "attractions", label: "Attractions" },
      { key: "restaurants", label: "Restaurants" },
      { key: "packingList", label: "Packing" },
      { key: "budget", label: "Budget" },
    ],
    attractions: [
      {
        id: "a_sagrada",
        title: "Sagrada Família",
        category: "Landmark",
        address: "C/ Mallorca, 401, 08013 Barcelona, Spain",
        rating: 4.8,
        priceLevel: "€€",
        expectedCost: 26, // EUR
        durationMin: 90,
        openingHours: "09:00–18:00",
        image:
          "https://images.unsplash.com/photo-1728249960363-13079cc2c6f6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      },
      {
        id: "a_gothic_quarter_walk",
        title: "Gothic Quarter Walking Tour",
        category: "Sightseeing",
        address:
          "Avinguda del Paral·lel, 36, 6, 1, Ciutat Vella, 08001 Barcelona, Spain",
        rating: 4.5,
        priceLevel: "Free",
        expectedCost: 0,
        durationMin: 120,
        openingHours: "Always open",
        image:
          "https://images.unsplash.com/photo-1722545406450-c63b16c07708?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=3387",
      },
      {
        id: "a_barceloneta_beach",
        title: "Barceloneta Beach",
        category: "Relaxation",
        address:
          "Passeig Marítim de la Barceloneta, 16, 08003 Barcelona, Spain",
        rating: 4.8,
        priceLevel: "Free",
        expectedCost: 0,
        durationMin: 180,
        openingHours: "Always open",
        image:
          "https://images.unsplash.com/photo-1627932227713-113d559667c0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=990",
      },
    ],
    restaurants: [
      {
        id: "r_arrosseria_gaudi",
        title: "Arrosseria Gaudí Restaurant",
        category: "Tapas Bar",
        address: "Av. de Gaudí, 44, 46, L'Eixample, 08025 Barcelona, Spain",
        rating: 4.5,
        priceLevel: "€€",
        durationMin: 90,
        openingHours: "08:00–Midnight",
        image:
          "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyC09MTG4o2zfombHQOnXN5F4FSSKOtl8o5mhX605WU3bo-71XY5Bo9UJBaIZDyniAV3k-G8SyY5E03p3rJ_-fROokbQ16ntVWxNO9swkiK7L8RHklznBHxC6rPfvjLeT0RfW9AIF1Bknk3=s1360-w1360-h1020-rw",
        expectedCost: 35,
      },
    ],
    mustSeeIds: ["a_sagrada", "r_arrosseria_gaudi"],
    packingList: [
      {
        category: "Clothes",
        items: [{ label: "Light sneakers" }, { label: "Jacket" }],
      },
      { category: "Tech", items: [{ label: "Power bank" }] },
    ],
    budget: {
      total: 10900,
      spent: 0,
      breakdown: {
        flights: 3500,
        accommodation: 3600,
        food: 1400,
        transport: 400,
        activities: 1200,
        other: 800,
      },
    },
  },
];
export default trips;
