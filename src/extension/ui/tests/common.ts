import { v1 } from "@docker/extension-api-client-types";
import { vi } from "vitest";

export const dummyClient: v1.DockerDesktopClient = {
  extension: {
    image: "",
  },
  desktopUI: {
    toast: {
      success: vi.fn(),
      warning: vi.fn(),
      error: vi.fn(),
    },
    dialog: {
      showOpenDialog: vi.fn(() =>
        Promise.resolve({
          filePaths: [],
          canceled: false,
        })
      ),
    },
    navigate: {
      viewContainers: vi.fn(() => Promise.resolve()),
      viewContainer: vi.fn(() => Promise.resolve()),
      viewContainerLogs: vi.fn(() => Promise.resolve()),
      viewContainerInspect: vi.fn(() => Promise.resolve()),
      viewContainerStats: vi.fn(() => Promise.resolve()),
      viewContainerTerminal: vi.fn(() => Promise.resolve()),
      viewImages: vi.fn(() => Promise.resolve()),
      viewImage: vi.fn(() => Promise.resolve()),
      viewVolumes: vi.fn(() => Promise.resolve()),
      viewVolume: vi.fn(() => Promise.resolve()),
      viewDevEnvironments: vi.fn(() => Promise.resolve()),
    },
  },
  host: {
    platform: "darwin",
    openExternal: vi.fn(() => Promise.resolve()),
    arch: "x64",
    hostname: "localhost",
  },
  docker: {
    cli: {
      exec: vi.fn(() => {
        const promise = Promise.resolve({
          lines: vi.fn(() => [] as string[]),
          parseJsonLines: vi.fn(() => [] as any[]),
          parseJsonObject: vi.fn(() => ({} as any)),
          stdout: "",
          stderr: "",
        });
        // Add close method to the promise
        (promise as any).close = vi.fn(() => Promise.resolve());
        return promise as any;
      }),
    },
    listContainers: vi.fn(() => Promise.resolve()),
    listImages: vi.fn(() => Promise.resolve()),
  },
};
