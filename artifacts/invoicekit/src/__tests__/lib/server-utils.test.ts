import { describe, it, expect } from "vitest";
import { normalizeAuthId, safeObjectId } from "@/lib/server-utils";
import { ObjectId } from "mongodb";

describe("server-utils", () => {
  describe("normalizeAuthId", () => {
    it("returns a non-empty string as-is", () => {
      expect(normalizeAuthId("abc123")).toBe("abc123");
    });

    it("returns a valid 24-char hex string as-is", () => {
      const hex = "507f1f77bcf86cd799439011";
      expect(normalizeAuthId(hex)).toBe(hex);
    });

    it("returns null for an empty string", () => {
      expect(normalizeAuthId("")).toBeNull();
    });

    it("returns null for null input", () => {
      expect(normalizeAuthId(null)).toBeNull();
    });

    it("returns null for undefined input", () => {
      expect(normalizeAuthId(undefined)).toBeNull();
    });

    it("returns null for a number input", () => {
      expect(normalizeAuthId(42)).toBeNull();
    });

    it("returns null for a boolean input", () => {
      expect(normalizeAuthId(true)).toBeNull();
    });

    it("uses toHexString() when available on an object", () => {
      const mockObjectId = {
        toHexString: () => "507f1f77bcf86cd799439011",
      };
      expect(normalizeAuthId(mockObjectId)).toBe("507f1f77bcf86cd799439011");
    });

    it("returns null when toHexString() returns empty string", () => {
      const mockObjectId = {
        toHexString: () => "",
      };
      expect(normalizeAuthId(mockObjectId)).toBeNull();
    });

    it("returns null when toHexString() returns [object Object]", () => {
      const mockObjectId = {
        toHexString: () => "[object Object]",
      };
      expect(normalizeAuthId(mockObjectId)).toBeNull();
    });

    it("uses Uint8Array buffer when present", () => {
      const hex = "deadbeefdeadbeefdeadbeef";
      const bytes = Buffer.from(hex, "hex");
      const mockWithBuffer = { buffer: new Uint8Array(bytes) };
      expect(normalizeAuthId(mockWithBuffer)).toBe(hex);
    });

    it("uses plain object buffer (Record<string, number>) when present", () => {
      const hex = "aabbccddeeff001122334455";
      const bytes = Buffer.from(hex, "hex");
      const bufferRecord: Record<string, number> = {};
      for (let i = 0; i < bytes.length; i++) {
        bufferRecord[i] = bytes[i];
      }
      const mockWithBuffer = { buffer: bufferRecord };
      expect(normalizeAuthId(mockWithBuffer)).toBe(hex);
    });

    it("falls back to toString() when no toHexString or buffer", () => {
      const mockObj = {
        toString: () => "some-string-id",
      };
      expect(normalizeAuthId(mockObj)).toBe("some-string-id");
    });

    it("returns null when toString() returns [object Object]", () => {
      // A plain object without toString override returns "[object Object]"
      expect(normalizeAuthId({})).toBeNull();
    });

    it("handles a real ObjectId object", () => {
      const id = new ObjectId("507f1f77bcf86cd799439011");
      const result = normalizeAuthId(id);
      expect(result).toBe("507f1f77bcf86cd799439011");
    });
  });

  describe("safeObjectId", () => {
    it("returns an ObjectId for a valid 24-char hex string", () => {
      const validId = "507f1f77bcf86cd799439011";
      const result = safeObjectId(validId);
      expect(result).not.toBeNull();
      expect(result?.toString()).toBe(validId);
    });

    it("returns null for an invalid string", () => {
      expect(safeObjectId("invalid-id")).toBeNull();
    });

    it("returns null for an empty string", () => {
      expect(safeObjectId("")).toBeNull();
    });

    it("returns null for null input", () => {
      expect(safeObjectId(null)).toBeNull();
    });

    it("returns null for undefined input", () => {
      expect(safeObjectId(undefined)).toBeNull();
    });

    it("returns an ObjectId that equals the input when used with .toString()", () => {
      const id = "507f191e810c19729de860ea";
      const result = safeObjectId(id);
      expect(result?.toString()).toBe(id);
    });

    it("returns null for a string shorter than 24 characters", () => {
      expect(safeObjectId("507f1f77bcf86cd7994390")).toBeNull();
    });

    it("returns null for a string with non-hex characters", () => {
      expect(safeObjectId("507f1f77bcf86cd79943901z")).toBeNull();
    });
  });
});