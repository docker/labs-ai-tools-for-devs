import { ReactNode } from "react";
import { Secret } from "../secrets";

/**
 * Interface for a catalog item
 */
export interface CatalogItem {
    description?: string;
    source?: string;
    icon?: string;
    secrets?: { name: string }[];
    ref: string;
    prompts: number;
    resources: object[];
    tools: { name: string }[];
    config?: any; // Configuration type
}

/**
 * Interface for a catalog item with a name
 */
export interface CatalogItemRichened extends CatalogItem {
    name: string;
    secrets: Secret[];
    config: { [key: string]: any };
    registered: boolean;
    canRegister: boolean;
}
