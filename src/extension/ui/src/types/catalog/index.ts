import { JsonSchema } from "json-schema-library";

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
  config?: JsonSchema;
}

// Base Catalog
export interface CatalogYaml {
  [itemName: string]: CatalogItem;
}

// End result when mapping out the catalog keys into a list
export interface CatalogItemWithName extends CatalogItem {
  name: string;
}

// Catalog item enrichened with all of the runtime information
export interface CatalogItemRichened extends CatalogItem {
  name: string;
  readme?: string;
  secrets: { name: string; assigned: boolean }[];
  configValue: { [key: string]: any };
  configSchema: JsonSchema;
  config?: JsonSchema;
  registered: boolean;
  canRegister: boolean;
  missingConfig: boolean;
  missingSecrets: boolean;
  configTemplate: { [key: string]: any };
}
