import { ReactNode } from "react";
import { Secret } from "../secrets";

/**
 * Interface for a catalog item
 */
export interface CatalogItem {
    description?: string;
    title?: string;
    source?: string;
    icon?: string;
    secrets?: { name: string }[];
    ref: string;
    prompts: number;
    resources: object[];
    tools: { name: string }[];
    config?: any; // Configuration type
}

export interface CatalogItemWithName extends CatalogItem {
    name: string;
}

/**
 * Interface for a catalog item with a name
 */
export interface CatalogItemRichened extends CatalogItem {
    name: string;
    readme?: string;
    secrets: { name: string, assigned: boolean }[];
    configValue: { [key: string]: any };
    configSchema: any;
    registered: boolean;
    canRegister: boolean;
    missingConfig: boolean;
    missingSecrets: boolean;
    configTemplate: { [key: string]: any };
}
