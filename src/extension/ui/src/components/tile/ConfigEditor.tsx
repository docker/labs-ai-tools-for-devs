import { v1 } from '@docker/extension-api-client-types';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import {
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import * as JsonSchema from 'json-schema-library';
import { useEffect, useMemo, useState } from 'react';

import * as JsonSchemaLibrary from "json-schema-library";
import {
  buildObjectFromFlattenedObject,
  deepFlattenObject,
} from '../../MergeDeep';
import { useConfig } from '../../queries/useConfig';
import { CatalogItemRichened } from '../../types/catalog';

JsonSchema.settings.GET_TEMPLATE_RECURSION_LIMIT = 1000;
JsonSchema.settings.templateDefaultOptions.addOptionalProps = true;

const ConfigEditor = ({
  catalogItem,
  client,
}: {
  catalogItem: CatalogItemRichened;
  client: v1.DockerDesktopClient;
}) => {
  const configSchema = catalogItem.configSchema;

  const {
    config,
    saveConfig: updateExistingConfig,
    configLoading,
  } = useConfig(client);

  const existingConfigForItem = catalogItem.configValue || {};

  const [localConfig, setLocalConfig] = useState<
    { [key: string]: any } | undefined
  >(undefined);

  // Use memoized flattenedConfig to ensure it only updates when config changes
  // This MUST be called before any early returns to avoid conditional hook calls
  const flattenedConfig = useMemo(
    () =>
      configSchema
        ? deepFlattenObject({
          ...catalogItem.configTemplate,
          ...existingConfigForItem,
        })
        : {},
    [catalogItem.configTemplate, existingConfigForItem, configSchema]
  );

  // Reset local config when the existing config changes
  useEffect(() => {
    if (!configSchema) return;
    setLocalConfig(flattenedConfig);
  }, [flattenedConfig]);

  // Early returns
  if (!configSchema) {
    return null;
  }

  if (!config && !configLoading) {
    return null;
  }

  if (configLoading) {
    return null;
  }

  if (!config || !localConfig) {
    return null;
  }

  const schema = new JsonSchemaLibrary.Draft2019(catalogItem.config[0]);
  const requiredAttributes = (schema.rootSchema.required || []) as string[];

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Parameters</Typography>
      <Stack>
        {Object.keys(flattenedConfig).map((key: string) => {
          const edited = localConfig[key] !== flattenedConfig[key];

          return (
            <Stack
              key={key}
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'center',
              }}
            >
              <TextField
                fullWidth
                size="small"
                label={`${key} ${requiredAttributes.includes(key) ? ' (required)' : ''}`}
                value={localConfig[key]}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, [key]: e.target.value })
                }
              />
              {edited && (
                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      const newConfig = sanitizeConfig(localConfig, catalogItem);
                      updateExistingConfig(catalogItem.name, newConfig);
                      setLocalConfig({
                        ...localConfig,
                        [key]: newConfig[key],
                      });
                    }}
                  >
                    <CheckOutlined
                      fontSize="small"
                      sx={{ color: 'success.main' }}
                    />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setLocalConfig({
                        ...localConfig,
                        [key]: flattenedConfig[key],
                      })
                    }
                  >
                    <CloseOutlined
                      fontSize="small"
                      sx={{ color: 'error.main' }}
                    />
                  </IconButton>
                </Stack>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

function sanitizeConfig(config: { [key: string]: any; }, catalogItem: CatalogItemRichened) {
  const newConfig = buildObjectFromFlattenedObject(config);

  // Remove all attributes which are optional and which have the defautl value
  const schema = new JsonSchemaLibrary.Draft2019(catalogItem.config[0]);
  const requiredAttributes = (schema.rootSchema.required || []) as string[];
  const template = schema.getTemplate({});
  const requiredConfig = Object.fromEntries(Object.entries(newConfig).filter(([key, value]) => {
    return requiredAttributes.includes(key) || (value !== template[key]);
  }));

  // Use the right types for each attribute
  const typedConfig = Object.fromEntries(Object.entries(requiredConfig).map(([key, value]) => {
    const propertyType = schema.rootSchema.properties[key].type;
    switch (propertyType) {
      case "integer":
        return [key, parseInt(value) || 0];
      case "boolean":
        return [key, (value as string).toLowerCase() === "true"];
      default:
        return [key, value];
    }
  }));

  return typedConfig;
}

export default ConfigEditor;