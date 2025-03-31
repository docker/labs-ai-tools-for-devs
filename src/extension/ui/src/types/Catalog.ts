export interface MCPServer {
    Prompts: number;
    Resources: Record<string, any> | null;
    Tools: Tool[] | null;
    Config: Config[] | null;
    Secrets: Secret[] | null;
    Examples: any[] | null;
}

export interface Tool {
    Name: string;
    Description: string;
}

export interface Config {
    Name: string;
    Description: string;
    Parameters?: Record<string, {
        Type: string;
        Items: any;
    }>;
}

export interface Secret {
    Name: string;
    Description: string;
}

export interface CatalogItem {
    Name: string;
    Description: string;
    Icon: string;
    CachedIcon: string;
    Ref: string;
    MCPServer: MCPServer;
    Tools: Tool[] | null;
    Propmts: number;
    Resources: Record<string, any> | null;
    Config: Config[] | null;
    Secrets: Secret[] | null;
    Examples: any[] | null;
}

export type Catalog = CatalogItem[];
