import { githubLightTheme, NodeData } from "json-edit-react"

import { githubDarkTheme } from "json-edit-react"

import { CircularProgress, useTheme } from "@mui/material";
import { JsonEditor } from "json-edit-react"
import { useEffect, useState } from "react";
import { CatalogItemWithName } from "./PromptCard";
import { getRegistry, getStoredConfig } from "../Registry";
import { v1 } from "@docker/extension-api-client-types";
import { mergeDeep } from "../MergeDeep";
import { stringify } from "yaml";
import { tryRunImageSync } from "../FileWatcher";

const types = ['string', 'number', 'boolean', 'array', 'object'] as const

type Parameter = {
    type?: typeof types[number];
    description?: string;
}

type ParameterArray = {
    type: 'array';
    items: Parameter;
    description?: string;
}

type ParameterObject = {
    type: 'object';
    properties: {
        [key: string]: Parameter;
    };
    description?: string;
}

type Parameters = Parameter | ParameterArray | ParameterObject;

export type ParsedParameter = string | number | boolean | { [key: string]: ParsedParameter } | ParsedParameter[];

type ParsedParameterArray = ParsedParameter[];

type ParsedParameterObject = Record<string, ParsedParameter>;

export type ParsedParameters = ParsedParameter | ParsedParameterArray | ParsedParameterObject;

export type Config = {
    name: string;
    description: string;
    parameters: Parameters
}[]




// Given a path in parsed JSON, returns the type of the value at that path from the tile's config
const jsonEditorTypeFilterFunction = ({ path }: NodeData, config: Config[number]['parameters']) => {
    if (path.length === 0) {
        return true
    }
    // Converts a path in parsed JSON BACK into config format with properties and items
    const configKeyFromPath = path.map(p => {
        if (typeof p === 'string') {
            return `properties.${p}`
        }
        if (typeof p === 'number') {
            return `items`
        }
        return p
    }).join('.')

    let configValue: any = { properties: config }
    for (const key of configKeyFromPath.split('.')) {
        configValue = configValue[key]
    }
    return [configValue.type]
}

// Converts a config parameter object into a parsed JSON object that is easier to edit using the json-edit-react library
const convertParametersToEditableJSON = (parameters: Config[number]['parameters']): ParsedParameters => {
    if (parameters.type === 'object') {
        return Object.fromEntries(Object.entries((parameters as ParameterObject).properties).map(([key, value]) => [key, convertParametersToEditableJSON(value)]))
    }
    if (parameters.type === 'array') {
        return [convertParametersToEditableJSON((parameters as ParameterArray).items)]
    }
    if (parameters.type === 'string') {
        return ''
    }
    if (parameters.type === 'number') {
        return 0
    }
    if (parameters.type === 'boolean') {
        return false
    }
    if (!parameters.type) {
        return Object.fromEntries(Object.entries(parameters).map(([key, value]) => [key, convertParametersToEditableJSON(value as Parameters)]))
    }
    return ''
}


// Given a path in parsed JSON, returns false to prevent editing anything but basic types
const jsonEditorFilterFunction = ({ value }: NodeData) => {
    if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean' || !value) {
        return false
    }
    // Return true to prevent editing
    return true
}

const PromptConfig = ({
    catalogItem,
    onRegistryChange,
    client
}: {
    catalogItem: CatalogItemWithName
    registryItem: { ref: string; config: any }
    onRegistryChange: () => void
    client: v1.DockerDesktopClient
}) => {
    const [existingConfigInYaml, setExistingConfigInYaml] = useState<ParsedParameters | undefined>(undefined)
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const loadExistingConfigInYaml = async () => {
            const currentStoredConfig = await getStoredConfig(client);
            setExistingConfigInYaml(currentStoredConfig[catalogItem.name] || {})
            setIsLoading(false)
        }
        loadExistingConfigInYaml()
    }, [])
    const saveConfigToYaml = async (newConfig: { [key: string]: ParsedParameters }) => {
        try {
            setIsLoading(true)
            const currentStoredConfig = await getStoredConfig(client);
            currentStoredConfig[catalogItem.name] = newConfig
            const payload = JSON.stringify({
                files: [{
                    path: 'config.yaml',
                    content: stringify(currentStoredConfig)
                }]
            })
            await tryRunImageSync(client, ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', `'${payload}'`])
            onRegistryChange();
        }
        catch (error) {
            client.desktopUI.toast.error('Failed to update config: ' + error);
        }
        setIsLoading(false)
    }
    if (!existingConfigInYaml || isLoading) {
        return <CircularProgress />
    }
    return <>
        {
            catalogItem.config!.map(config => (
                <JsonEditor
                    key={config.name}
                    theme={theme.palette.mode === 'dark' ? githubDarkTheme : githubLightTheme}
                    onEdit={({ newData }) => {
                        const newConfig = mergeDeep(existingConfigInYaml, newData)
                        saveConfigToYaml(newConfig)
                    }}
                    rootName={config.name}
                    restrictAdd={({ value }) => {
                        return !Array.isArray(value)
                    }}
                    defaultValue={""}
                    restrictDelete={true}
                    restrictEdit={jsonEditorFilterFunction}
                    restrictTypeSelection={(e) => jsonEditorTypeFilterFunction(e, config.parameters)}
                    data={{ ...(convertParametersToEditableJSON(config.parameters) as ParameterObject), ...(existingConfigInYaml as ParameterObject) }}
                />
            ))
        }
    </>
}

export default PromptConfig