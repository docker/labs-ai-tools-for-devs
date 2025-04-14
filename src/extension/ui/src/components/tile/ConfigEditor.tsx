import { CircularProgress, TextField, Typography } from "@mui/material";
import { Alert, Stack } from "@mui/material";
import { CatalogItemWithName } from "../../types/catalog";
import { useEffect, useState } from "react";
import * as JsonSchema from "json-schema-library";
import { useConfigContext } from "../../context/ConfigContext";
import { config } from "process";
import { deepFlattenObject, mergeDeep } from "../../MergeDeep";

JsonSchema.settings.GET_TEMPLATE_RECURSION_LIMIT = 1000;
JsonSchema.settings.templateDefaultOptions.addOptionalProps = true;

const EmptyState = () => {
    return (
        <Alert severity="info"> No config available </Alert>
    )
}

const LoadingState = () => {
    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress />
            <Typography>Loading config...</Typography>
        </Stack>
    )
}

const ConfigEditor = ({ catalogItem }: { catalogItem: CatalogItemWithName }) => {
    const configSchema = catalogItem.config;
    const { config: existingConfig, saveConfig, configLoading } = useConfigContext();

    if (!configSchema) {
        return <EmptyState />
    }

    if (!existingConfig && !configLoading) {
        return <EmptyState />
    }

    if (configLoading) {
        return <LoadingState />
    }

    const [config, setConfig] = useState(existingConfig);

    useEffect(() => {
        const myJsonSchema: JsonSchema.JsonSchema = { properties: { ...configSchema[0].parameters, type: 'object' } };


        const schema = new JsonSchema.Draft2019(myJsonSchema);
        const template = schema.getTemplate(undefined, undefined);

        console.log('template', template, 'existingConfig', existingConfig, 'schema', myJsonSchema);
        // setConfig(template);
    }, [configSchema, existingConfig]);

    useEffect(() => {
        console.log(config);
    }, [config]);

    return (
        <Stack>
            <Stack direction="row" spacing={2}>

            </Stack>
        </Stack>
    )
}

export default ConfigEditor;
