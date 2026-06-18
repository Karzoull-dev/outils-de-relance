import { describe, expect, it } from "vitest";
import { formatDateOnly, formatDateTimeFR } from "./datetime";

describe("formatDateOnly", () => {
  it("converts ISO date to French day/month/year without timezone shifts", () => {
    expect(formatDateOnly("2026-06-17")).toBe("17/06/2026");
  });
});

describe("formatDateTimeFR", () => {
  it("formats a Date as DD/MM/YYYY à HHhMM", () => {
    const date = new Date(2026, 5, 17, 9, 5);
    expect(formatDateTimeFR(date)).toBe("17/06/2026 à 09h05");
  });
});
