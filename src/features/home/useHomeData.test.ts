import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useHomeData from "./useHomeData";
//import { pairingContacts } from "@/mocks/mockPairings";

vi.mock("@/mocks/mockPairings", () => ({
  pairingContacts: [
    {
      id: "1",
      profile: {
        name: "John",
        surname: "Doe",
        pairingStatus: "Paired",
      },
      lastPairedAt: "2025-01-01T12:00:00Z",
    },
    {
      id: "2",
      profile: {
        name: "Jane",
        surname: "Doe",
        pairingStatus: "Paired",
      },
      lastPairedAt: "2025-02-01T12:00:00Z",
    },
    {
      id: "3",
      profile: {
        name: "Peter",
        surname: "Jones",
        pairingStatus: "Seeking Pair",
      },
      lastPairedAt: "2024-01-01T12:00:00Z",
    },
  ],
}));

describe("useHomeData", () => {
  it("should return the correct data", () => {
    const { result } = renderHook(() => useHomeData());

    expect(result.current.firstName).toBe("Ferko");
    expect(result.current.currentPairing?.id).toBe("2");
    expect(result.current.stats.activeSince).toBe("2025-02-01T12:00:00Z");
    expect(result.current.stats.pairingsThisYear).toBe(2);
    expect(result.current.stats.successfulPairingsThisYear).toBe(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isEmpty).toBe(false);
  });
});
