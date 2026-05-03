import { PackageListResponse, TravelPackage } from "@/types/package";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchPackages(): Promise<PackageListResponse> {
  const response = await fetch(`${API_BASE}/api/packages?pageSize=20`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load packages");
  }

  return response.json();
}

export async function fetchPackageById(id: string): Promise<TravelPackage> {
  const response = await fetch(`${API_BASE}/api/packages/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Package not found");
  }

  return response.json();
}

export async function fetchSimilarPackages(
  destination?: string,
  category?: string,
  limit: number = 4
): Promise<TravelPackage[]> {
  const params = new URLSearchParams({
    pageSize: String(limit),
  });

  if (destination) {
    params.append("destination", destination);
  }

  if (category) {
    params.append("category", category);
  }

  const response = await fetch(`${API_BASE}/api/packages?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load similar packages");
  }

  const data = await response.json();
  return data.packages || [];
}
