import { describe, expect, it, vi, afterEach } from "vitest";
import { formatCurrency, formatInvoiceNumber, getInvoiceStatus } from "./invoices";

describe("getInvoiceStatus", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns paid when paid_at is set, regardless of due date", () => {
    expect(
      getInvoiceStatus({ due_date: "2020-01-01", paid_at: "2026-01-01T00:00:00Z" }),
    ).toBe("paid");
  });

  it("returns late when due date is in the past and unpaid", () => {
    vi.setSystemTime(new Date("2026-06-17T12:00:00Z"));
    expect(getInvoiceStatus({ due_date: "2026-06-01", paid_at: null })).toBe("late");
  });

  it("returns pending when due date is today or in the future and unpaid", () => {
    vi.setSystemTime(new Date("2026-06-17T12:00:00Z"));
    expect(getInvoiceStatus({ due_date: "2026-06-17", paid_at: null })).toBe("pending");
    expect(getInvoiceStatus({ due_date: "2026-07-01", paid_at: null })).toBe("pending");
  });
});

describe("formatCurrency", () => {
  it("formats EUR amounts in French locale", () => {
    expect(formatCurrency(1234.5, "EUR", "fr")).toContain("1");
    expect(formatCurrency(1234.5, "EUR", "fr")).toContain("€");
  });
});

describe("formatInvoiceNumber", () => {
  it("pads the sequential number to 4 digits and prefixes with the year", () => {
    expect(
      formatInvoiceNumber({ number: 7, created_at: "2026-03-12T10:00:00Z" }),
    ).toBe("FA-2026-0007");
  });

  it("does not truncate numbers beyond 4 digits", () => {
    expect(
      formatInvoiceNumber({ number: 12345, created_at: "2026-03-12T10:00:00Z" }),
    ).toBe("FA-2026-12345");
  });
});
