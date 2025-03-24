import { Alert, Badge, Box, Chip, CircularProgress, IconButton, Stack, Switch, Tooltip, useTheme } from "@mui/material";
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
    setConfiguringItem: (item: CatalogItemWithName) => void;
    item: CatalogItemWithName; // Associated CatalogItemWithName
    canRegister: boolean;
    registered: boolean;
    register: (item: CatalogItemWithName) => Promise<void>;
    unregister: (item: CatalogItemWithName) => Promise<void>;
    onSecretChange: (secret: { name: string, value: string }) => Promise<void>;
    secrets: Secrets.Secret[];
    ddVersion: { version: string, build: number };
    unAssignedConfig: { name: string, assigned: boolean }[];
}

const TileConfigBadge = ({ children, unAssignedConfig, unAssignedSecrets }: { children: React.ReactNode, unAssignedConfig: { name: string, assigned: boolean }[], unAssignedSecrets: { name: string, assigned: boolean }[] }) => {
    if (unAssignedConfig.length > 0) {
        return <Badge badgeContent={unAssignedConfig.length} color="warning">
            {children}
        </Badge>
    }
    if (unAssignedSecrets.length > 0) {
        return <Badge badgeContent={unAssignedSecrets.length} color="warning">
            {children}
        </Badge>
    }
    return <>{children}</>;
}

const TileActions = ({ item, registered, register, unregister, onSecretChange, secrets, ddVersion, unAssignedConfig }: TileActionsProps) => {
    const loadAssignedSecrets = () => {
        const assignedSecrets = Secrets.getAssignedSecrets(item, secrets);
        setAssignedSecrets(assignedSecrets)
    }
    const [isRegistering, setIsRegistering] = useState(false)
    const [showConfigModal, setShowConfigModal] = useState(false)
    const [assignedSecrets, setAssignedSecrets] = useState<{ name: string, assigned: boolean }[]>([])

    useEffect(() => {
        loadAssignedSecrets()
    }, [secrets])

    const unAssignedSecrets = assignedSecrets.filter(s => !s.assigned)

    const hasAllSecrets = unAssignedSecrets.length === 0

    const hasDDVersionWithSecretSupport = ddVersion && ddVersion.build >= DD_BUILD_WITH_SECRET_SUPPORT;

    const canBeConfigured = assignedSecrets.length > 0 || item.config

    const hasAllConfig = unAssignedConfig.length === 0

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
                        <TileConfigBadge unAssignedConfig={unAssignedConfig} unAssignedSecrets={unAssignedSecrets}>
                            <Settings sx={{ color: 'text.secondary' }} />
                        </TileConfigBadge>
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
                <Switch checked={registered} onChange={async (event, checked) => {
                    setIsRegistering(true)
                    if (checked) {
                        await register(item)
                    } else {
                        await unregister(item)
                    }
                    setIsRegistering(false)
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
            />

            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    {!!item.tools?.length && <Chip label={`${item.tools.length} tool` + (item.tools.length > 1 ? 's' : '')} color="primary" />}
                    {!item.tools?.length && !!item.prompts && <Chip label={`${item.prompts} prompt(s)`} color="secondary" />}
                    {!item.tools?.length && !item.prompts && item.resources?.length && <Chip label={`${item.resources.length} resource(s)`} color="success" />}
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                    {getActionButton()}
                </Stack>
            </Stack>
        </>
    )
}

export default TileActions;