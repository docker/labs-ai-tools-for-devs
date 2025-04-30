// From secrets.yaml

import { v1 } from "@docker/extension-api-client-types";
import { CatalogItemWithName } from "./types/catalog";
import { Secret } from "./types/secrets";
import { encode } from "js-base64";

namespace Secrets {
  export async function getSecrets(
    client: v1.DockerDesktopClient
  ): Promise<Secret[]> {
    const response = await client.extension.host?.cli.exec("host-binary", [
      "list",
    ]);
    if (!response) {
      client.desktopUI.toast.error(
        "Failed to get secrets. Could not get response from host-binary."
      );
    }
    if (response?.stderr) {
      client.desktopUI.toast.error(
        "Failed to get secrets: " + JSON.stringify(response)
      );
    }
    return JSON.parse(response?.stdout || "[]");
  }

  export async function addSecret(
    client: v1.DockerDesktopClient,
    secret: Secret
  ): Promise<void> {
    try {
      const base64Value = encode(secret.value ?? '');
      const response = await client.extension.host?.cli.exec("host-binary", [
        "--name",
        secret.name,
        "--base64",
        "--value",
        client.host.platform === "win32" ? `\"${base64Value}\"` : `'${base64Value}'`,
      ]);
      if (!response) {
        client.desktopUI.toast.error(
          "Failed to set secret. Could not get response from host-binary."
        );
      }
      if (response?.stderr) {
        client.desktopUI.toast.error(
          "Failed to set secret: " + JSON.stringify(response)
        );
      }
    } catch (error) {
      if ((error as any).stderr) {
        client.desktopUI.toast.error(
          "Failed to set secret: " + JSON.stringify(error)
        );
      } else {
        client.desktopUI.toast.error("Failed to set secret: " + error);
      }
    }
  }

  export async function deleteSecret(
    client: v1.DockerDesktopClient,
    name: string
  ): Promise<void> {
    try {
      const response = await client.extension.host?.cli.exec("host-binary", [
        "delete",
        "--name",
        name,
      ]);
      if (!response) {
        client.desktopUI.toast.error(
          "Failed to delete secret. Could not get response from host-binary."
        );
        throw new Error(
          "Failed to delete secret. Could not get response from host-binary."
        );
      }
      if (response?.stderr) {
        client.desktopUI.toast.error(
          "Failed to delete secret: " + JSON.stringify(response)
        );
        throw new Error("Failed to delete secret: " + JSON.stringify(response));
      }
    } catch (error) {
      if ((error as any).stderr) {
        client.desktopUI.toast.error(
          "Failed to delete secret: " + JSON.stringify(error)
        );
      } else {
        client.desktopUI.toast.error("Failed to delete secret: " + error);
      }
    }
  }

  // Get all relevant secrets for a given set of catalog items
  export function getAllSecretNames(
    catalogItems: CatalogItemWithName[]
  ): string[] {
    return catalogItems
      .map((item) => item.secrets || [])
      .flat()
      .map((secret) => secret.name);
  }

  // Whether or not each secret has been assigned for a given catalog item
  export function getSecretsWithAssignment(
    catalogItem: CatalogItemWithName,
    secrets: Secret[]
  ): { name: string; assigned: boolean }[] {
    return (
      catalogItem.secrets?.map((secret) => ({
        name: secret.name,
        assigned: secrets.some((s) => s.name === secret.name),
      })) || []
    );
  }
}

export default Secrets;
