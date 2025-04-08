/**
 * Type definition for a basic parameter
 */
export type Parameter = {
    type?: "string" | "number" | "boolean" | "array" | "object";
    description?: string;
};

/**
 * Type definition for an array parameter
 */
export type ParameterArray = {
    type: 'array';
    items: Parameter;
    description?: string;
};

/**
 * Type definition for an object parameter
 */
export type ParameterObject = {
    type: 'object';
    properties: {
        [key: string]: Parameter;
    };
    description?: string;
};

/**
 * Union type for all parameter types
 */
export type Parameters = Parameter | ParameterArray | ParameterObject;

/**
 * Type for parsed parameters (any value)
 */
export type ParsedParameter = any;

/**
 * Type for parsed parameter arrays
 */
export type ParsedParameterArray = any[];

/**
 * Type for parsed parameter objects
 */
export type ParsedParameterObject = Record<string, any>;

/**
 * Type for any parsed parameter
 */
export type ParsedParameters = any;

/**
 * Type definition for configuration
 */
export type Config = {
    name: string;
    description: string;
    parameters: Parameters
}[];

/**
 * Base TrackingRecord interface
 */
interface TrackingRecord {
    event: string;
    properties: object;
    event_timestamp?: number;
    source?: string;
}

/**
 * Interface for record reflecting registry changes
 */
export interface RegistryChangedRecord extends TrackingRecord {
    event: 'registry-changed';
    properties: {
        name: string;
        ref: string;
        action: 'remove' | 'add';
    };
}

/**
 * Interface for record reflecting Claude config changes
 */
export interface ClaudeConfigChangedRecord extends TrackingRecord {
    event: 'claude-config-changed';
    properties: {
        action: 'add' | 'remove' | 'write' | 'delete';
        newvalue?: string;
        oldvalue?: string;
    };
} 