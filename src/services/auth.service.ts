import { User, LoginCredentials, RegisterData, AuthResponse } from "@/types/auth";
import { authApi } from "./api.service";

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const data = await authApi.login(credentials.email, credentials.password);

      const user: User = {
        id: data._id,
        email: data.email,
        name: data.name,
        role: data.role,
        createdAt: new Date(),
      };

      localStorage.setItem("auth-token", data.token);
      localStorage.setItem("auth-user", JSON.stringify(user));

      return { user, token: data.token };
    } catch (err) {
      // Fallback to demo users if backend is unreachable
      return this._demoLogin(credentials);
    }
  }

  private async _demoLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise((r) => setTimeout(r, 800));
    const demo = DEMO_USERS.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
    if (!demo) throw new Error("Invalid email or password");

    const user: User = {
      id: demo.id,
      email: demo.email,
      name: demo.name,
      role: demo.role as "user" | "admin",
      createdAt: new Date(demo.createdAt),
    };
    const token = `demo-token-${demo.id}`;
    localStorage.setItem("auth-token", token);
    localStorage.setItem("auth-user", JSON.stringify(user));
    return { user, token };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    try {
      const res = await authApi.register(data.name, data.email, data.password);

      const user: User = {
        id: res._id,
        email: res.email,
        name: res.name,
        role: res.role,
        createdAt: new Date(),
      };

      localStorage.setItem("auth-token", res.token);
      localStorage.setItem("auth-user", JSON.stringify(user));

      return { user, token: res.token };
    } catch (err) {
      throw err instanceof Error ? err : new Error("Registration failed");
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
  }

  getCurrentUser(): User | null {
    try {
      const str = localStorage.getItem("auth-user");
      return str ? JSON.parse(str) : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem("auth-token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  getDemoCredentials() {
    return DEMO_USERS.map((u) => ({
      email: u.email,
      password: u.password,
      name: u.name,
      role: u.role,
    }));
  }
}

// Demo users for offline/demo mode
const DEMO_USERS = [
  {
    id: "demo-1",
    email: "admin@travelai.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    createdAt: "2024-01-01",
  },
  {
    id: "demo-2",
    email: "demo@travelai.com",
    password: "demo123",
    name: "Demo User",
    role: "user",
    createdAt: "2024-01-01",
  },
];

export const authService = new AuthService();
