import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useHomeData from "./useHomeData";

const THIS_YEAR = new Date().getFullYear();

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { user_metadata: { first_name: "Ferko" } },
  }),
}));

const mockPairingContacts = [
  {
    id: "2",
    profile: { firstName: "Jane", lastName: "Doe", pairingStatus: "met" },
    pairedAt: `${THIS_YEAR}-02-01T12:00:00Z`,
    lastMessageAt: "",
    messages: [],
  },
  {
    id: "1",
    profile: { firstName: "John", lastName: "Doe", pairingStatus: "met" },
    pairedAt: `${THIS_YEAR}-01-01T12:00:00Z`,
    lastMessageAt: "",
    messages: [],
  },
  {
    id: "3",
    profile: {
      firstName: "Peter",
      lastName: "Jones",
      pairingStatus: "planned",
    },
    pairedAt: `${THIS_YEAR - 2}-01-01T12:00:00Z`,
    lastMessageAt: "",
    messages: [],
  },
];

const usePairingsQueryMock = vi.fn(() => ({
  loading: false,
  pairingContacts: mockPairingContacts,
}));

vi.mock("@/features/pairings/api/usePairingsQuery", () => ({
  usePairingsQuery: () => usePairingsQueryMock(),
}));

vi.mock("@/features/pairings/api/useActivePairingPeriodQuery", () => ({
  useActivePairingPeriodQuery: () => ({
    data: {
      activePairingPeriod: { startDate: `${THIS_YEAR}-02-01T12:00:00Z` },
    },
  }),
}));

describe("useHomeData", () => {
  it("returns current pairing, stats and identity", () => {
    const { result } = renderHook(() => useHomeData());

    expect(result.current.firstName).toBe("Ferko");
    expect(result.current.currentPairing?.id).toBe("2");
    expect(result.current.stats.activeSince).toBe(
      `${THIS_YEAR}-02-01T12:00:00Z`
    );
    expect(result.current.stats.pairingsThisYear).toBe(2);
    expect(result.current.stats.successfulPairingsThisYear).toBe(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isEmpty).toBe(false);
  });

  it("reports empty state when there are no pairings", () => {
    usePairingsQueryMock.mockReturnValueOnce({
      loading: false,
      pairingContacts: [],
    });

    const { result } = renderHook(() => useHomeData());

    expect(result.current.currentPairing).toBeNull();
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.stats.pairingsThisYear).toBe(0);
  });
});
