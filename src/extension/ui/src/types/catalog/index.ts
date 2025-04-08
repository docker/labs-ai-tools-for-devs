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
    tools: object[];
    config?: any; // Configuration type
}

/**
 * Interface for a catalog item with a name
 */
export interface CatalogItemWithName extends CatalogItem {
    name: string;
}

/**
 * Interface for tile props
 */
export interface TileProps {
    item: CatalogItemWithName;
    registered: boolean;
    onSecretChange: (secret: { name: string, value: string }) => Promise<void>;
    secrets: Secret[];
    ActionsSlot: ReactNode;
}

/**
 * Interface for tile actions props
 */
export interface TileActionsProps {
    item: CatalogItemWithName;
    registered: boolean;
    setConfiguringItem?: (item: CatalogItemWithName) => void;
    canRegister?: boolean;
    register: (item: CatalogItemWithName) => Promise<void>;
    unregister: (item: CatalogItemWithName) => Promise<void>;
    onSecretChange: (secret: { name: string, value: string }) => Promise<void>;
    secrets: Secret[];
    ddVersion: { version: string, build: number };
    unAssignedConfig: { name: string, assigned: boolean }[];
} 