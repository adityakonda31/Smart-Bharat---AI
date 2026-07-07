import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Onboarding } from "./Onboarding";
import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from "../context/LanguageContext";

describe("Onboarding Questionnaire Component", () => {
  test("renders onboarding form steps and labels correctly in default English theme", () => {
    render(
      <LanguageProvider>
        <AuthProvider>
          <Onboarding />
        </AuthProvider>
      </LanguageProvider>
    );

    // Should display slide 1 title
    expect(screen.getByText(/Onboarding Profile Setup/i)).toBeInTheDocument();
    expect(screen.getByText(/Let's configure your profile base/i)).toBeInTheDocument();
    
    // Should display labels
    expect(screen.getByText(/Your Age/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender Identity/i)).toBeInTheDocument();
  });
});
