import { ReactNode } from "react";
import { Secret } from "../secrets";

/**
 * Interface for a catalog item
 */
export interface CatalogItem {
    description?: string;
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
export interface CatalogItemWithName extends CatalogItem {
    name: string;
}
