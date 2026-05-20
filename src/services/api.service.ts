// Central API service — all backend calls go through here

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function isDemoToken(token: string | null): boolean {
  return !!token && token.startsWith("demo-token-");
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("auth-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface BackendUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  token: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  getProfile: () => request<BackendUser>("/api/auth/profile"),

  updateProfile: (data: { name?: string; email?: string; password?: string }) =>
    request<AuthResponse>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Wishlist
  getWishlist: () => request<any[]>("/api/auth/wishlist"),
  toggleWishlist: (packageId: string) =>
    request<{ saved: boolean; count: number }>(`/api/auth/wishlist/${packageId}`, { method: "PUT" }),
  addToWishlist: (packageId: string) =>
    request<{ saved: boolean; count: number }>(`/api/auth/wishlist/${packageId}`, { method: "POST" }),
  removeFromWishlist: (packageId: string) =>
    request<{ saved: boolean; count: number }>(`/api/auth/wishlist/${packageId}`, { method: "DELETE" }),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

export interface Booking {
  _id: string;
  user: { _id: string; name: string; email: string } | string;
  packageItem: {
    _id: string;
    title: string;
    images?: string[];
    destination?: { name: string };
  } | null;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  discount: number;
  paymentMethod: string;
  isPaid: boolean;
  paidAt?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

export const bookingApi = {
  create: (data: {
    packageId: string;
    startDate: string;
    endDate: string;
    guests: number;
    paymentMethod?: string;
    promoCode?: string;
  }) =>
    request<Booking>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createCheckoutSession: (bookingId: string) =>
    request<{ url: string }>(`/api/bookings/${bookingId}/create-checkout-session`, {
      method: "POST",
    }),

  getMyBookings: (): Promise<Booking[]> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
    if (isDemoToken(token)) return Promise.resolve(DEMO_BOOKINGS);
    return request<Booking[]>("/api/bookings/mybookings");
  },

  getById: (id: string) => request<Booking>(`/api/bookings/${id}`),

  pay: (id: string) =>
    request<Booking>(`/api/bookings/${id}/pay`, { method: "PUT" }),

  updateStatus: (id: string, status: string) =>
    request<Booking>(`/api/bookings/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  // Admin
  getAll: (): Promise<Booking[]> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
    if (isDemoToken(token)) return Promise.resolve(DEMO_BOOKINGS);
    return request<Booking[]>("/api/bookings");
  },
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalPackages: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: Booking[];
  monthlyRevenue?: { _id: { year: number; month: number }; revenue: number; count: number }[];
  statusBreakdown?: { _id: string; count: number }[];
}

export const adminApi = {
  getStats: (): Promise<AdminStats> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
    if (isDemoToken(token)) return Promise.resolve(DEMO_STATS);
    return request<AdminStats>("/api/admin/stats");
  },
  getUsers: (): Promise<BackendUser[]> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
    if (isDemoToken(token)) return Promise.resolve(DEMO_USERS_LIST);
    return request<BackendUser[]>("/api/admin/users");
  },
  deleteUser: (id: string) =>
    request<{ message: string }>(`/api/admin/users/${id}`, { method: "DELETE" }),
  updateUserRole: (id: string, role: string) =>
    request<BackendUser>(`/api/admin/users/${id}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    }),
  // Reviews
  getReviews: (status?: string) =>
    request<any[]>(`/api/admin/reviews${status ? `?status=${status}` : ""}`),
  updateReview: (id: string, status: string) =>
    request<any>(`/api/admin/reviews/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
  deleteReview: (id: string) =>
    request<{ message: string }>(`/api/admin/reviews/${id}`, { method: "DELETE" }),
  // AI Stats
  getAIStats: () => request<any>("/api/admin/ai-stats"),
  // System Logs
  getLogs: (limit?: number) =>
    request<any[]>(`/api/admin/logs${limit ? `?limit=${limit}` : ""}`),
  // Settings
  getSettings: () => request<any>("/api/admin/settings"),
};

// ─── Packages ─────────────────────────────────────────────────────────────────

export const packageApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ packages: any[]; page: number; pages: number; total: number }>(
      `/api/packages${qs}`
    );
  },
  getById: (id: string) => request<any>(`/api/packages/${id}`),
  create: (data: any) =>
    request<any>("/api/packages", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/api/packages/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<{ message: string }>(`/api/packages/${id}`, { method: "DELETE" }),
};

// ─── Upload ───────────────────────────────────────────────────────────────────

export const uploadApi = {
  uploadImage: async (file: File, type: "package" | "destination" | "avatar" = "package"): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append("image", file);

    const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
    const res = await fetch(`${API_BASE}/api/upload/${type}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || "Upload failed");
    }
    return res.json();
  },

  uploadMultiple: async (files: File[]): Promise<{ images: { url: string; publicId: string }[] }> => {
    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));

    const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
    const res = await fetch(`${API_BASE}/api/upload/package/multiple`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      console.error("uploadMultiple error:", err);
      throw new Error(err.message || "Upload failed");
    }
    return res.json();
  },

  deleteImage: async (publicId: string): Promise<void> => {
    await request(`/api/upload/${encodeURIComponent(publicId)}`, { method: "DELETE" });
  },
};

export const destinationApi = {
  getAll: () => request<any[]>("/api/destinations"),
  create: (data: any) =>
    request<any>("/api/destinations", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/api/destinations/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<{ message: string }>(`/api/destinations/${id}`, { method: "DELETE" }),
};

// ─── Demo fallback data (used when demo-token is active) ──────────────────────

const DEMO_BOOKINGS: Booking[] = [
  {
    _id: "demo-booking-1",
    user: { _id: "demo-1", name: "Admin User", email: "admin@travelai.com" },
    packageItem: {
      _id: "demo-pkg-1",
      title: "European Adventure",
      images: ["/api/placeholder/400/200"],
      destination: { name: "Paris, France" },
    },
    startDate: "2025-06-10",
    endDate: "2025-06-20",
    guests: 2,
    totalPrice: 2499,
    discount: 0,
    paymentMethod: "MockPayment",
    isPaid: true,
    status: "confirmed",
    createdAt: "2025-05-01",
  },
  {
    _id: "demo-booking-2",
    user: { _id: "demo-1", name: "Admin User", email: "admin@travelai.com" },
    packageItem: {
      _id: "demo-pkg-2",
      title: "Bali Paradise",
      images: ["/api/placeholder/400/200"],
      destination: { name: "Bali, Indonesia" },
    },
    startDate: "2025-08-01",
    endDate: "2025-08-08",
    guests: 1,
    totalPrice: 899,
    discount: 179.8,
    paymentMethod: "MockPayment",
    isPaid: false,
    status: "pending",
    createdAt: "2025-05-10",
  },
];

const DEMO_STATS: AdminStats = {
  totalUsers: 3,
  totalPackages: 12,
  totalBookings: 8,
  totalRevenue: 15420,
  recentBookings: DEMO_BOOKINGS,
  monthlyRevenue: [
    { _id: { year: 2025, month: 3 }, revenue: 2400, count: 2 },
    { _id: { year: 2025, month: 4 }, revenue: 5200, count: 4 },
    { _id: { year: 2025, month: 5 }, revenue: 7820, count: 6 },
  ],
  statusBreakdown: [
    { _id: "confirmed", count: 4 },
    { _id: "pending", count: 2 },
    { _id: "completed", count: 1 },
    { _id: "cancelled", count: 1 },
  ],
};

const DEMO_USERS_LIST: BackendUser[] = [
  { _id: "demo-1", name: "Admin User", email: "admin@travelai.com", role: "admin", createdAt: "2024-01-01" },
  { _id: "demo-2", name: "Demo User", email: "demo@travelai.com", role: "user", createdAt: "2024-01-01" },
];
