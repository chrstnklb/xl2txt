import { replaceDots } from "../kalendarium";

describe("replaceDots", () => {
  it("should convert a number to a string with comma as decimal separator", () => {
    expect(replaceDots(123.45)).toBe("123,45");
  });

  it("should convert a string with dot to comma", () => {
    expect(replaceDots("1.23")).toBe("1,23");
  });

  it("should return the same value if no dot is present", () => {
    expect(replaceDots("123")).toBe("123");
  });

  it("should return the input if not a string or number", () => {
    expect(replaceDots(null)).toBe(null);
    expect(replaceDots(undefined)).toBe(undefined);
  });
});