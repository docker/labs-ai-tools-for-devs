import { Badge, Box, CircularProgress, IconButton, Stack, Switch, Tooltip, useTheme } from "@mui/material";
import { Article, AttachFile, Build, Settings } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Secrets from "../../Secrets";
import { DD_BUILD_WITH_SECRET_SUPPORT, getUnsupportedSecretMessage } from "../../Constants";
import { Config } from "../ConfigurationModal";
import { trackEvent } from "../../Usage";
import ConfigurationModal from "../ConfigurationModal";
import { v1 } from "@docker/extension-api-client-types";
import { createDockerDesktopClient } from "@docker/extension-api-client";

const iconSize = 16;

// Initialize the Docker Desktop client
const client = createDockerDesktopClient();

export interface CatalogItem {
    description?: string;
    icon?: string;
    secrets?: { name: string }[];
    ref: string;
    prompts: number;
    resources: object[];
    tools: object[];
    config?: Config;
}

export interface CatalogItemWithName extends CatalogItem {
    name: string;
}

export interface TileActionsProps {
    hasAllConfig: boolean;
    setConfiguringItem: (item: CatalogItemWithName) => void;
    item: CatalogItemWithName; // Associated CatalogItemWithName
    canRegister: boolean;
    registered: boolean;
    register: (item: CatalogItemWithName) => Promise<void>;
    unregister: (item: CatalogItemWithName) => Promise<void>;
    onSecretChange: (secret: { name: string, value: string }) => Promise<void>;
    secrets: Secrets.Secret[];
    ddVersion: { version: string, build: number };
}

const TileActions = ({ hasAllConfig, setConfiguringItem, item, canRegister, registered, register, unregister, onSecretChange, secrets, ddVersion }: TileActionsProps) => {
    const loadAssignedSecrets = () => {
        const assignedSecrets = Secrets.getAssignedSecrets(item, secrets);
        setAssignedSecrets(assignedSecrets)
    }
    const [isRegistering, setIsRegistering] = useState(false)
    const [showConfigModal, setShowConfigModal] = useState(false)
    const [assignedSecrets, setAssignedSecrets] = useState<{ name: string, assigned: boolean }[]>([])
    const [tooltipOpen, setTooltipOpen] = useState(false) // Tooltip is controlled because it needs to be programatically closed.

    useEffect(() => {
        loadAssignedSecrets()
    }, [secrets])

    const hasAllSecrets = assignedSecrets.every(s => s.assigned)

    const hasDDVersionWithSecretSupport = ddVersion && ddVersion.build >= DD_BUILD_WITH_SECRET_SUPPORT;

    const canBeConfigured = assignedSecrets.length > 0 || item.config

    const getActionButton = () => {
        if (isRegistering) {
            return <Tooltip title="Waiting for Docker Desktop to be ready...">
                <CircularProgress size={20} />
            </Tooltip>
        }
        if (!hasAllSecrets || !hasAllConfig) {
            return <Stack direction="row" spacing={0} alignItems="center">
                <Tooltip title={hasAllSecrets ? "Missing configuration. Click to set." : hasDDVersionWithSecretSupport ? "Missing secrets. Click to set." : getUnsupportedSecretMessage(ddVersion)}>
                    <IconButton onClick={() => setShowConfigModal(true)}>
                        <Settings sx={{ color: 'text.secondary' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="This tile needs configuration before it can be used.">
                    <span>
                        <Switch checked={false} disabled />
                    </span>
                </Tooltip>
            </Stack>
        }
        return <Stack direction="row" spacing={0} alignItems="center">
            {canBeConfigured && <Tooltip title="Configure this tile">
                <IconButton onClick={() => {
                    setShowConfigModal(true)
                }}>
                    <Settings />
                </IconButton>
            </Tooltip>}
            <Tooltip title={registered ? "Unregistering this tile will hide it from MCP clients." : "Registering this tile will expose it to MCP clients."}>
                <Switch checked={registered} onChange={(event, checked) => {
                    if (checked) {
                        register(item)
                    } else {
                        unregister(item)
                    }
                }} />
            </Tooltip>
        </Stack>
    }

    return (
        <>
            {/* Use the new ConfigurationModal component */}
            <ConfigurationModal
                open={showConfigModal}
                onClose={() => setShowConfigModal(false)}
                catalogItem={item}
                client={client}
                secrets={secrets}
                onSecretChange={onSecretChange}
            />

            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1, padding: 1, boxSizing: 'border-box' }}>
                        <Tooltip title="Prompts">
                            <Badge badgeContent={item.prompts || "0"} color="primary">
                                <Article sx={{ fontSize: iconSize, color: 'secondary.main' }} />
                            </Badge>
                        </Tooltip>
                        <Tooltip title="Resources">
                            <Badge badgeContent={item.resources?.length || "0"} color="secondary">
                                <AttachFile sx={{ fontSize: iconSize, color: 'secondary.main' }} />
                            </Badge>
                        </Tooltip>
                        <Tooltip title="Tools">
                            <Badge badgeContent={item.tools?.length || "0"} color="success">
                                <Build sx={{ fontSize: iconSize, color: 'secondary.main' }} />
                            </Badge>
                        </Tooltip>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                    {getActionButton()}
                </Stack>
            </Stack>
        </>
    )
}

export default TileActions;