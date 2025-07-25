export const ENERGY_TYPES = [
  { value: "solar", label: "Solar" },
  { value: "wind", label: "Wind" },
  { value: "hydro", label: "Hydro" },
  { value: "biomass", label: "Biomass" },
  { value: "geothermal", label: "Geothermal" },
] as const;

export const PROJECT_STATUSES = [
  { value: "operational", label: "Operational" },
  { value: "in-progress", label: "Under Construction" },
  { value: "planning", label: "Planning" },
  { value: "decommissioned", label: "Decommissioned" },
] as const;

export const LOCATIONS = [
  { value: "rajasthan", label: "Rajasthan" },
  { value: "tamil-nadu", label: "Tamil Nadu" },
  { value: "karnataka", label: "Karnataka" },
  { value: "andhra-pradesh", label: "Andhra Pradesh" },
  { value: "gujarat", label: "Gujarat" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "madhya-pradesh", label: "Madhya Pradesh" },
  { value: "uttar-pradesh", label: "Uttar Pradesh" },
  { value: "punjab", label: "Punjab" },
  { value: "himachal-pradesh", label: "Himachal Pradesh" },
  { value: "uttarakhand", label: "Uttarakhand" },
  { value: "jammu-kashmir", label: "Jammu & Kashmir" },
  { value: "west-bengal", label: "West Bengal" },
  { value: "odisha", label: "Odisha" },
  { value: "haryana", label: "Haryana" },
  { value: "kerala", label: "Kerala" },
  { value: "telangana", label: "Telangana" },
] as const;

export const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "capacity", label: "Capacity" },
  { value: "year", label: "Year" },
  { value: "energyType", label: "Energy Type" },
] as const;

export const ITEMS_PER_PAGE = 10;

export const ENERGY_TYPE_COLORS = {
  solar: "#FF9800",
  wind: "#1976D2",
  hydro: "#2196F3",
  biomass: "#4CAF50",
  geothermal: "#9C27B0",
  other: "#666666"
} as const;

export const STATUS_COLORS = {
  operational: "bg-green-100 text-green-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  planning: "bg-blue-100 text-blue-800",
  decommissioned: "bg-red-100 text-red-800",
} as const;
