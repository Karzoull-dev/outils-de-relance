import { describe, expect, it } from "vitest";
import { getDueReminderType } from "./reminders";

describe("getDueReminderType", () => {
  it("returns J-3 three days before the due date", () => {
    expect(getDueReminderType("2026-06-20", "2026-06-17")).toBe("J-3");
  });

  it("returns J0 on the due date", () => {
    expect(getDueReminderType("2026-06-17", "2026-06-17")).toBe("J0");
  });

  it("returns J+7 seven days after the due date", () => {
    expect(getDueReminderType("2026-06-10", "2026-06-17")).toBe("J+7");
  });

  it("returns J+14 fourteen days after the due date", () => {
    expect(getDueReminderType("2026-06-03", "2026-06-17")).toBe("J+14");
  });

  it("returns J+30 thirty days after the due date", () => {
    expect(getDueReminderType("2026-05-18", "2026-06-17")).toBe("J+30");
  });

  it("returns null when no offset matches", () => {
    expect(getDueReminderType("2026-06-18", "2026-06-17")).toBeNull();
    expect(getDueReminderType("2026-06-01", "2026-06-17")).toBeNull();
  });
});
