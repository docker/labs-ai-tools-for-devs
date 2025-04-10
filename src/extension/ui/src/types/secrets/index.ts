/**
 * Type definition for a Secret
 */
export type Secret = {
    name: string;
    value: string;
    policies: string[];
};

/**
 * Type definition for a stored secret
 */
export type StoredSecret = {
    name: string;
    policies: string[];
};

/**
 * Type definition for a policy
 */
export type Policy = {
    name: string;
    images: string[];
}; 