import { describe, expect, it } from "vitest";
import { isPortfolioAdminEmail } from "./db";

describe("portfolio admin access", () => {
  it("recognizes the configured admin email without case sensitivity", () => {
    expect(isPortfolioAdminEmail("azizovbahriddin20020504@gmail.com")).toBe(true);
    expect(isPortfolioAdminEmail("AZIZOVBAHRIDDIN20020504@GMAIL.COM")).toBe(true);
  });

  it("does not grant admin access to another user", () => {
    expect(isPortfolioAdminEmail("student@example.com")).toBe(false);
    expect(isPortfolioAdminEmail(undefined)).toBe(false);
  });
});
