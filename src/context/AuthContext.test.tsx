import React from "react";
import { describe, test, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

const TestingComponent: React.FC = () => {
  const { user, isAuthenticated, loginWithEmail, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-state">{isAuthenticated ? "logged-in" : "logged-out"}</span>
      <span data-testid="user-name">{user ? user.fullName : "Guest"}</span>
      <button 
        data-testid="btn-login" 
        onClick={() => loginWithEmail("test.citizen@gov.in")}
      >
        Login
      </button>
      <button 
        data-testid="btn-logout" 
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

describe("AuthContext Authentication Flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("initializes as unauthenticated Guest by default", () => {
    render(
      <AuthProvider>
        <TestingComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("auth-state").textContent).toBe("logged-out");
    expect(screen.getByTestId("user-name").textContent).toBe("Guest");
  });

  test("performs login correctly and sets active user state", async () => {
    render(
      <AuthProvider>
        <TestingComponent />
      </AuthProvider>
    );

    const btnLogin = screen.getByTestId("btn-login");

    await act(async () => {
      btnLogin.click();
      // Wait for simulated network latency (800ms)
      await new Promise((resolve) => setTimeout(resolve, 850));
    });

    expect(screen.getByTestId("auth-state").textContent).toBe("logged-in");
    expect(screen.getByTestId("user-name").textContent).toBe("Rahul Sharma");
  });

  test("performs logout correctly and clears session cache", async () => {
    render(
      <AuthProvider>
        <TestingComponent />
      </AuthProvider>
    );

    const btnLogin = screen.getByTestId("btn-login");
    const btnLogout = screen.getByTestId("btn-logout");

    await act(async () => {
      btnLogin.click();
      await new Promise((resolve) => setTimeout(resolve, 850));
    });

    expect(screen.getByTestId("auth-state").textContent).toBe("logged-in");

    act(() => {
      btnLogout.click();
    });

    expect(screen.getByTestId("auth-state").textContent).toBe("logged-out");
    expect(screen.getByTestId("user-name").textContent).toBe("Guest");
    expect(localStorage.getItem("smart_bharat_auth")).toBeNull();
  });
});
