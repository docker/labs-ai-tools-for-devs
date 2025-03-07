// From secrets.yaml

import { v1 } from "@docker/extension-api-client-types";
import { CatalogItemWithName } from "./components/PromptCard";

namespace Secrets {
    export type Secret = {
        name: string;
        value: string;
        policies: string[];
    }

    export type StoredSecret = {
        name: string;
        policies: string[];
    }

    export type Policy = {
        name: string;
        images: string[];
    }

    export async function getSecrets(client: v1.DockerDesktopClient): Promise<Secret[]> {
        const response = await client.extension.host?.cli.exec('host-binary', ['list']);
        return JSON.parse(response?.stdout || '[]');
    }


    export async function addSecret(client: v1.DockerDesktopClient, secret: Secret): Promise<void> {
        try {
            const response = await client.extension.host?.cli.exec('host-binary', ['--name', secret.name, '--value', secret.value]);
            console.log('Response', response)
            client.desktopUI.toast.success('Secret set successfully')
        } catch (error) {
            if ((error as any).stderr) {
                client.desktopUI.toast.error('Failed to set secret: ' + JSON.stringify(error))
            } else {
                client.desktopUI.toast.error('Failed to set secret: ' + error)
            }
        }
    }

    // Get all relevant secrets for a given set of catalog items
    export function getAllSecretNames(catalogItems: CatalogItemWithName[]): string[] {
        return catalogItems.map((item) => item.secrets || []).flat().map((secret) => secret.name);
    }

    // Whether or not each secret has been assigned for a given catalog item
    export function getAssignedSecrets(catalogItem: CatalogItemWithName, secrets: Secret[]): { name: string, assigned: boolean }[] {
        return catalogItem.secrets?.map((secret) => ({ name: secret.name, assigned: secrets.some((s) => s.name === secret.name) })) || [];
    }
}

export default Secrets;