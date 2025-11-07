export const trips = [
  {
    id: "t_barcelona_weekend_2025_11",
    title: "Barcelona Weekend Getaway",
    tripStatus: "planned", // planned , ongoing, completed
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
        priceLevel: "$$",
        expectedCost: 260,
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
        priceLevel: "$$",
        durationMin: 90,
        openingHours: "08:00–Midnight",
        image:
          "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyC09MTG4o2zfombHQOnXN5F4FSSKOtl8o5mhX605WU3bo-71XY5Bo9UJBaIZDyniAV3k-G8SyY5E03p3rJ_-fROokbQ16ntVWxNO9swkiK7L8RHklznBHxC6rPfvjLeT0RfW9AIF1Bknk3=s1360-w1360-h1020-rw",
        expectedCost: 350,
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
      expenses: [
        {
          id: "e_flight",
          title: "Flight tickets",
          amount: 3500,
          category: "Transport",
          isPaid: false,
        },
        {
          id: "e_hotel",
          title: "Hotel (3 nights)",
          amount: 3600,
          category: "Accommodation",
          isPaid: false,
        },
        {
          id: "e_food",
          title: "Food & Drinks",
          amount: 1400,
          category: "Food & Drinks",
          isPaid: false,
        },
        {
          id: "e_local_transport",
          title: "Local transport",
          amount: 400,
          category: "Transport",
          isPaid: false,
        },
        {
          id: "e_activities",
          title: "Activities",
          amount: 1200,
          category: "Activities",
          isPaid: false,
        },
        {
          id: "e_other",
          title: "Other",
          amount: 800,
          category: "Other",
          isPaid: false,
        },
      ],
    },
  },

  {
    id: "t_Bali_2025_11",
    title: " Bali Island Escape",
    tripStatus: "ongoing", // planned , ongoing, completed
    coverImage:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1335",
    destination: { city: "Bali", country: "Indonesia" },
    dates: { start: "2025-11-04", end: "2025-11-14", nights: 9 },
    tabSections: [
      { key: "mustSees", label: "Must-Sees" },
      { key: "attractions", label: "Attractions" },
      { key: "restaurants", label: "Restaurants" },
      { key: "packingList", label: "Packing" },
      { key: "budget", label: "Budget" },
    ],
    attractions: [
      {
        id: "a_tegalalang",
        title: "Tegallalang Rice Terrace",
        category: "Nature",
        address: "Tegallalang, Gianyar Regency",
        rating: 4.3,
        priceLevel: "$$",
        expectedCost: 200,
        durationMin: 180,
        openingHours: "Always open",
        image:
          "https://plus.unsplash.com/premium_photo-1697729933176-7b999b743f8c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=927",
      },
      {
        id: "a_uluwatu",
        title: "Uluwatu Temple",
        category: "Sightseeing",
        address: "Pecatu, South Kuta",
        rating: 4.5,
        priceLevel: "$$",
        expectedCost: 30,
        durationMin: 180,
        openingHours: "07:00–19:00",
        image:
          "https://images.unsplash.com/photo-1604842937136-1648761a6256?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1365",
      },
      {
        id: "a_canggu_beach",
        title: "Canggu Beach",
        category: "Relaxation",
        address: "Canggu, North Kuta",
        rating: 4.8,
        priceLevel: "Free",
        expectedCost: 0,
        durationMin: 180,
        openingHours: "Always open",
        image:
          "https://images.unsplash.com/photo-1564221549673-b43c122d1c29?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=968",
      },
    ],
    restaurants: [
      {
        id: "r_warung_babi_guling",
        title: "Warung Babi Guling Ibu Oka",
        category: "Balinese  Cuisine",
        address: "Jl. Suweta No.2, Ubud, Gianyar Regency, Bali, Indonesia",
        rating: 4.6,
        priceLevel: "$$$",
        durationMin: 90,
        openingHours: "08:00–22:00",
        image:
          "https://images.unsplash.com/photo-1751110314375-ca26cbbc5a6a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
        expectedCost: 250,
      },
    ],
    mustSeeIds: ["a_tegalalang", "a_uluwatu", "a_canggu_beach"],
    packingList: [
      {
        category: "Clothes",
        items: [
          { label: "Light sneakers" },
          { label: "Jacket" },
          { label: "Swimwear" },
          { label: "Hat / Cap" },
        ],
      },
      {
        category: "Tech",
        items: [
          { label: "Power bank" },
          { label: "Travel adapter (Type C/F)" },
        ],
      },
      {
        category: "Essentials",
        items: [{ label: "Sunscreen SPF 50+" }, { label: "Bug spray" }],
      },
    ],
    budget: {
      total: 11300,
      expenses: [
        {
          id: "e_flight",
          title: "Flights",
          amount: 1500,
          category: "Transport",
          isPaid: false,
        },
        {
          id: "e_hotel",
          title: "Accommodation",
          amount: 4500,
          category: "Accommodation",
          isPaid: false,
        },
        {
          id: "e_food",
          title: "Food & Drinks",
          amount: 2000,
          category: "Food & Drinks",
          isPaid: false,
        },
        {
          id: "e_local_transport",
          title: "Local transport",
          amount: 500,
          category: "Transport",
          isPaid: false,
        },
        {
          id: "e_activities",
          title: "Activities",
          amount: 2000,
          category: "Activities",
          isPaid: false,
        },
        {
          id: "e_other",
          title: "Other",
          amount: 800,
          category: "Other",
          isPaid: false,
        },
      ],
    },
  },

  {
    id: "t_Stockholm_2025_01",
    title: "Stockholm Winter Lights",
    tripStatus: "completed", // planned , ongoing, completed
    coverImage:
      "https://plus.unsplash.com/premium_photo-1697729828023-35f1eb84db3e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
    destination: { city: "Stockholm", country: "Sweden" },
    dates: { start: "2025-01-10", end: "2025-01-15", nights: 5 },
    tabSections: [
      { key: "mustSees", label: "Must-Sees" },
      { key: "attractions", label: "Attractions" },
      { key: "restaurants", label: "Restaurants" },
      { key: "packingList", label: "Packing" },
      { key: "budget", label: "Budget" },
    ],
    attractions: [
      {
        id: "a_gamla_stan",
        title: "Gamla Stan",
        category: "Sightseeing",
        address: "Old Town, Stockholm",
        rating: 4.7,
        priceLevel: "Free",
        expectedCost: 0,
        durationMin: 120,
        openingHours: "Always open",
        image:
          "https://images.unsplash.com/photo-1665938025129-ab56b64afebc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=927",
      },
      {
        id: "a_vasa_museum",
        title: "Vasa Museum",
        category: "Museum",
        address: "Galärvarvsvägen 14, Djurgården, Stockholm",
        rating: 4.8,
        priceLevel: "$$$",
        expectedCost: 180,
        durationMin: 150,
        openingHours: "10:00–17:00",
        image:
          "https://images.unsplash.com/photo-1677755998695-3a029eb6b51b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2069",
      },
      {
        id: "a_abba_museum",
        title: "ABBA The Museum",
        category: "Entertainment",
        address: "Djurgårdsvägen 68, Stockholm",
        rating: 4.6,
        priceLevel: "$$$",
        expectedCost: 250,
        durationMin: 120,
        openingHours: "10:00–18:00",
        image:
          "https://images.unsplash.com/photo-1665060221922-aff438b69d36?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      },
    ],
    restaurants: [
      {
        id: "r_pelikan",
        title: "Pelikan",
        category: "Traditional Swedish",
        address: "Blekingegatan 40, Södermalm, Stockholm",
        rating: 4.5,
        priceLevel: "$$$",
        expectedCost: 300,
        durationMin: 90,
        openingHours: "11:30–23:00",
        image:
          "https://images.unsplash.com/photo-1723062332051-36bc882e3549?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1335",
      },
      {
        id: "r_cafe_saturdays",
        title: "Café Saturdays",
        category: "Café / Bakery",
        address: "Drottninggatan 55, Stockholm",
        rating: 4.4,
        priceLevel: "$$",
        expectedCost: 100,
        durationMin: 60,
        openingHours: "08:00–18:00",
        image:
          "https://images.unsplash.com/photo-1707846396119-630407daf600?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      },
    ],
    mustSeeIds: ["a_gamla_stan", "a_vasa_museum", "a_abba_museum"],
    packingList: [
      {
        category: "Clothes",
        items: [
          { label: "Winter jacket" },
          { label: "Warm boots" },
          { label: "Scarf & gloves" },
          { label: "Thermal socks" },
        ],
      },
      {
        category: "Tech",
        items: [
          { label: "Camera" },
          { label: "Power bank" },
          { label: "Travel adapter" },
        ],
      },
      {
        category: "Essentials",
        items: [
          { label: "Lip balm" },
          { label: "Moisturizer" },
          { label: "Travel insurance papers" },
        ],
      },
    ],
    budget: {
      total: 8900,
      expenses: [
        {
          id: "e_flight",
          title: "Flights",
          amount: 1200,
          category: "Transport",
          isPaid: true,
        },
        {
          id: "e_hotel",
          title: "Accommodation",
          amount: 3200,
          category: "Accommodation",
          isPaid: true,
        },
        {
          id: "e_food",
          title: "Food & Drinks",
          amount: 1800,
          category: "Food & Drinks",
          isPaid: true,
        },
        {
          id: "e_local_transport",
          title: "Local transport",
          amount: 700,
          category: "Transport",
          isPaid: true,
        },
        {
          id: "e_activities",
          title: "Activities",
          amount: 1500,
          category: "Activities",
          isPaid: true,
        },
        {
          id: "e_other",
          title: "Other",
          amount: 500,
          category: "Other",
          isPaid: true,
        },
      ],
    },
  },
];

export default trips;
