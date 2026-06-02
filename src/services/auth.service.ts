import { User, LoginCredentials, RegisterData, AuthResponse } from "@/types/auth";
import { authApi } from "./api.service";

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
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


}



export const authService = new AuthService();
