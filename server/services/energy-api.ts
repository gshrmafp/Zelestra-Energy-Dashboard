import { InsertProject } from "@shared/schema";

interface NRELProject {
  project_name: string;
  owner: string;
  energy_type: string;
  capacity_mw: number;
  state: string;
  status: string;
  year: number;
  latitude?: number;
  longitude?: number;
}

export class EnergyAPIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NREL_API_KEY || process.env.ENERGY_API_KEY || "demo_key";
    this.baseUrl = "https://developer.nrel.gov/api";
  }

  async fetchRenewableProjects(): Promise<InsertProject[]> {
    try {
      // Use a sample of renewable energy data structure
      // In a real implementation, this would call the actual NREL API
      const response = await fetch(
        `${this.baseUrl}/uswtdb/v1/turbines?api_key=${this.apiKey}&format=json&limit=100`
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform NREL data to our project structure
      return this.transformNRELData(data);
    } catch (error) {
      console.error("Error fetching renewable projects:", error);
      // Return sample data structure if API fails
      return this.getSampleProjects();
    }
  }

  private transformNRELData(data: any): InsertProject[] {
    if (!data || !Array.isArray(data)) {
      return this.getSampleProjects();
    }

    return data.map((item: any) => ({
      name: item.project_name || `Project ${item.case_id}`,
      owner: item.owner || "Unknown Owner",
      energyType: this.normalizeEnergyType(item.energy_type || "wind"),
      capacity: parseFloat(item.capacity_mw || item.t_cap || "0"),
      location: `${item.t_state || item.state || "Unknown"}, USA`,
      status: this.normalizeStatus(item.status || "operational"),
      year: parseInt(item.year || item.p_year || "2023"),
      latitude: item.ylat || item.latitude,
      longitude: item.xlong || item.longitude,
    }));
  }

  private normalizeEnergyType(type: string): string {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("wind")) return "Wind";
    if (lowerType.includes("solar")) return "Solar";
    if (lowerType.includes("hydro")) return "Hydro";
    if (lowerType.includes("biomass")) return "Biomass";
    if (lowerType.includes("geothermal")) return "Geothermal";
    return "Wind"; // Default to wind
  }

  private normalizeStatus(status: string): string {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("operational") || lowerStatus.includes("operating")) return "Operational";
    if (lowerStatus.includes("construction") || lowerStatus.includes("building")) return "Construction";
    if (lowerStatus.includes("planning") || lowerStatus.includes("proposed")) return "Planning";
    if (lowerStatus.includes("cancelled") || lowerStatus.includes("canceled")) return "Cancelled";
    return "Operational"; // Default
  }

  private getSampleProjects(): InsertProject[] {
    return [
      {
        name: "Desert Sun Solar Farm",
        owner: "SolarTech Industries",
        energyType: "Solar",
        capacity: "150.5",
        location: "California, USA",
        status: "Operational",
        year: 2023,
        latitude: "34.0522",
        longitude: "-118.2437",
      },
      {
        name: "Windmere Wind Farm",
        owner: "Green Energy Corp",
        energyType: "Wind",
        capacity: "240.0",
        location: "Texas, USA",
        status: "Construction",
        year: 2024,
        latitude: "31.9686",
        longitude: "-99.9018",
      },
      {
        name: "Cascade Hydro Plant",
        owner: "Hydro Power Inc",
        energyType: "Hydro",
        capacity: "85.2",
        location: "Oregon, USA",
        status: "Operational",
        year: 2022,
        latitude: "44.9778",
        longitude: "-123.0351",
      },
    ];
  }
}

export const energyAPIService = new EnergyAPIService();
