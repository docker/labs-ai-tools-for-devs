export interface ExpectedConfigPath {
    darwin: string;
    linux: string;
    win32: string;
}

export interface Client {
    name: string;
    url: string;
    manual_config_steps: string[];
    expected_config_path: ExpectedConfigPath;
}

export type Clients = Client[];
