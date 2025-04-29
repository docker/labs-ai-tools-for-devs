/**
 * FileWatcher.ts
 * This file is not used due to inability to clean up inotifywait processes
 */
import { v1 } from "@docker/extension-api-client-types";
import { ExecResult } from "@docker/extension-api-client-types/dist/v0";
import { encode } from "js-base64";
import { BUSYBOX } from "../Constants";

export const tryRunImageSync = async (
  client: v1.DockerDesktopClient,
  args: string[],
  ignoreError = false
) => {
  const showError = ignoreError ? () => { } : client.desktopUI.toast.error;
  try {
    const result = await client.docker.cli.exec("run", args);
    if (result.stderr && result.stderr.includes("shell operators are not allowed")) {
      // This shouldn't happen: it means we have our escaping wrong.
      // And there's no way to check that failure other than by looking at stderr's content...
      showError(result.stderr);
    }
    return result.stdout || "";
  } catch (e) {
    if (e instanceof Error) {
      showError(e.message);
    }
    if ((e as ExecResult).stderr) {
      showError(JSON.stringify(e));
    }
    return "";
  }
};

let user: string | null = null;

export const getUser = async (client: v1.DockerDesktopClient) => {
  if (user == null) {
    const result = await tryRunImageSync(client, [
      "--rm",
      "-e",
      "USER",
      BUSYBOX,
      "/bin/sh",
      "-c",
      client.host.platform === "win32"
        ? `\"echo $USER\"`
        : `'echo $USER'`,
    ]);
    user = result.trim();
  }
  return user;
};

export const readFileInPromptsVolume = async (
  client: v1.DockerDesktopClient,
  path: string
) => {
  return tryRunImageSync(
    client,
    [
      "--rm",
      "-v",
      "docker-prompts:/docker-prompts:ro",
      "--network=none",
      "-w",
      "/docker-prompts",
      BUSYBOX,
      "/bin/cat",
      `${path}`,
    ],
    true
  );
};

export const writeToPromptsVolume = async (
  client: v1.DockerDesktopClient,
  filename: string,
  content: string
) => {
  return tryRunImageSync(client, [
    "--rm",
    "-v",
    "docker-prompts:/workdir",
    "--network=none",
    "-w",
    "/workdir",
    BUSYBOX,
    "/bin/sh",
    "-c",
    client.host.platform === "win32"
      ? `\"echo ${encode(content)} | base64 -d > ${filename}\"`
      : `'echo ${encode(content)} | base64 -d > ${filename}'`,
  ]);
};

export const writeToMount = async (
  client: v1.DockerDesktopClient,
  mount: string,
  filename: string,
  content: string
) => {
  return tryRunImageSync(client, [
    "--rm",
    "--mount",
    mount,
    "--network=none",
    BUSYBOX,
    "/bin/sh",
    "-c",
    client.host.platform === "win32"
      ? `\"echo ${encode(content)} | base64 -d > ${filename}\"`
      : `'echo ${encode(content)} | base64 -d > ${filename}'`,
  ]);
};
