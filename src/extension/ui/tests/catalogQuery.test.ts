import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { dummyClient } from "./common";
import { describe, test, expect, beforeAll } from "vitest";
import { useCatalogAll } from "../src/queries/useCatalog";

/**
 * @vitest-environment jsdom
 */

// Create QueryClient for tests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Create a simple wrapper function
const wrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children
  );
};

describe("Catalog Query", () => {
  // Import hook in test

  test("useCatalogAll hook should load data correctly", async () => {
    // make sure localStorage is defined

    const { result } = renderHook(() => useCatalogAll(dummyClient), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.catalogLoading).toBe(false);
      expect(result.current.registryLoading).toBe(false);
      expect(result.current.catalogItems.length).toBeGreaterThan(0);
      expect(Object.keys(result.current.registryItems!)).toEqual([]);
    });
  });
});
