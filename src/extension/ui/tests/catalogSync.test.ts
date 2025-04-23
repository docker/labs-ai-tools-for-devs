import { describe, test, expect } from "vitest";
import { syncRegistryWithConfig } from "../src/Registry";
import { dummyClient } from "./common";

describe("Sync registry with config", () => {
  test("empty registry", async () => {
    const registry = {};

    const config = {
      "catalog-item": {
        "config-key": "config-value",
      },
    };

    const result = await syncRegistryWithConfig(dummyClient, registry, config);
    expect(result).toEqual(undefined);
  });
  test("empty config", async () => {
    const registry = {
      "catalog-item": {
        ref: "test",
        config: undefined,
      },
    };

    const config = {};

    const result = await syncRegistryWithConfig(dummyClient, registry, config);
    expect(result).toEqual(undefined);
  });
  test("should no-op if registry is correct", async () => {
    const registry = {
      "catalog-item": {
        ref: "test",
        config: {
          "catalog-item": {
            "config-key": "config-value",
          },
        },
      },
    };

    const config = {
      "catalog-item": {
        "config-key": "config-value",
      },
    };

    const result = await syncRegistryWithConfig(dummyClient, registry, config);
    expect(result).toEqual(registry);
  });
  test("sets empty config", async () => {
    const registry = {
      "catalog-item": {
        ref: "test",
        config: {},
      },
    };

    const config = {
      "catalog-item": {
        "config-key": "config-value",
      },
    };

    const result = await syncRegistryWithConfig(dummyClient, registry, config);
    expect(result).toEqual({
      "catalog-item": {
        ref: "test",
        config: {
          "catalog-item": {
            "config-key": "config-value",
          },
        },
      },
    });
  });
  test("sets filled config", async () => {
    const registry = {
      "catalog-item": {
        ref: "test",
        config: {
          "catalog-item": {
            "config-key": "config-value",
          },
        },
      },
    };

    const config = {
      "catalog-item": {
        "config-key": "new-config-value",
      },
    };

    const result = await syncRegistryWithConfig(dummyClient, registry, config);
    expect(result).toEqual({
      "catalog-item": {
        ref: "test",
        config: {
          "catalog-item": {
            "config-key": "new-config-value",
          },
        },
      },
    });
  });
});
