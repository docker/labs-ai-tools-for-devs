import { v1 } from '@docker/extension-api-client-types';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import {
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import * as JsonSchema from 'json-schema-library';
import { useEffect, useMemo, useState } from 'react';

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
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());

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

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Config</Typography>
      <Stack direction="column" spacing={2}>
        {Object.keys(flattenedConfig).map((key: string) => {
          const edited = localConfig[key] !== flattenedConfig[key];
          const isSaving = savingKeys.has(key);

          return (
            <Stack key={key} direction="row" spacing={2}>
              <TextField
                size="small"
                label={key}
                value={localConfig[key] || ''}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, [key]: e.target.value })
                }
                disabled={isSaving}
              />
              {edited && (
                <Stack direction="row" spacing={2}>
                  {isSaving ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Stack direction="row" spacing={2}>
                      <IconButton
                        onClick={() =>
                          updateExistingConfig(
                            catalogItem.name,
                            buildObjectFromFlattenedObject(localConfig)
                          )
                        }
                        disabled={isSaving}
                      >
                        <CheckOutlined sx={{ color: 'success.main' }} />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          setLocalConfig({
                            ...localConfig,
                            [key]: flattenedConfig[key],
                          })
                        }
                        disabled={isSaving}
                      >
                        <CloseOutlined sx={{ color: 'error.main' }} />
                      </IconButton>
                    </Stack>
                  )}
                </Stack>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default ConfigEditor;
