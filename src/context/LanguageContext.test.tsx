import React from "react";
import { describe, test, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "./LanguageContext";

const TestingComponent: React.FC = () => {
  const { currentLanguage, setLanguage, t, translateDynamic } = useLanguage();
  return (
    <div>
      <span data-testid="lang-code">{currentLanguage}</span>
      <span data-testid="title">{t("title")}</span>
      <span data-testid="dynamic-scheme">
        {translateDynamic("AI GOVERNMENT SCHEME FINDER")}
      </span>
      <button 
        data-testid="btn-hindi" 
        onClick={() => setLanguage("hi")}
      >
        Switch to Hindi
      </button>
      <button 
        data-testid="btn-telugu" 
        onClick={() => setLanguage("te")}
      >
        Switch to Telugu
      </button>
    </div>
  );
};

describe("LanguageContext Translation Engine", () => {
  test("initializes with default English vocabulary", () => {
    render(
      <LanguageProvider>
        <TestingComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId("lang-code").textContent).toBe("en");
    expect(screen.getByTestId("title").textContent).toBe("SMART BHARAT");
    expect(screen.getByTestId("dynamic-scheme").textContent).toBe("AI GOVERNMENT SCHEME FINDER");
  });

  test("translates statically mapped keys and dynamic titles to Hindi", () => {
    render(
      <LanguageProvider>
        <TestingComponent />
      </LanguageProvider>
    );

    const btnHindi = screen.getByTestId("btn-hindi");
    
    act(() => {
      btnHindi.click();
    });

    expect(screen.getByTestId("lang-code").textContent).toBe("hi");
    expect(screen.getByTestId("title").textContent).toBe("स्मार्ट भारत");
    expect(screen.getByTestId("dynamic-scheme").textContent).toBe("एआई सरकारी योजना खोजक");
  });

  test("applies regional indicators fallback for other languages", () => {
    render(
      <LanguageProvider>
        <TestingComponent />
      </LanguageProvider>
    );

    const btnTelugu = screen.getByTestId("btn-telugu");

    act(() => {
      btnTelugu.click();
    });

    expect(screen.getByTestId("lang-code").textContent).toBe("te");
    expect(screen.getByTestId("dynamic-scheme").textContent).toContain("(తెలుగు)");
  });
});
