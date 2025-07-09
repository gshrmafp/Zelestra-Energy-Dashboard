export const ENERGY_TYPES = [
  { value: "solar", label: "Solar" },
  { value: "wind", label: "Wind" },
  { value: "hydro", label: "Hydro" },
  { value: "biomass", label: "Biomass" },
  { value: "geothermal", label: "Geothermal" },
] as const;

export const PROJECT_STATUSES = [
  { value: "operational", label: "Operational" },
  { value: "construction", label: "Under Construction" },
  { value: "planning", label: "Planning" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const LOCATIONS = [
  { value: "california", label: "California" },
  { value: "texas", label: "Texas" },
  { value: "florida", label: "Florida" },
  { value: "new-york", label: "New York" },
  { value: "oregon", label: "Oregon" },
  { value: "washington", label: "Washington" },
] as const;

export const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "capacity", label: "Capacity" },
  { value: "year", label: "Year" },
  { value: "energyType", label: "Energy Type" },
] as const;

export const ITEMS_PER_PAGE = 10;

export const ENERGY_TYPE_COLORS = {
  Solar: "#FF9800",
  Wind: "#1976D2",
  Hydro: "#2196F3",
  Biomass: "#4CAF50",
  Geothermal: "#9C27B0",
} as const;

export const STATUS_COLORS = {
  Operational: "bg-green-100 text-green-800",
  Construction: "bg-yellow-100 text-yellow-800",
  Planning: "bg-blue-100 text-blue-800",
  Cancelled: "bg-red-100 text-red-800",
} as const;
