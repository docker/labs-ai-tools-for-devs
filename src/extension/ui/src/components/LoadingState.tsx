import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box, CircularProgress, Fade, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

// Initialize the Docker Desktop client
const client = createDockerDesktopClient();

interface LoadingStateProps {
    appProps: any; // We'll use this to pass all our hook data
}

const LoadingState: React.FC<LoadingStateProps> = ({ appProps }) => {
    // Extract the loading states from appProps
    const { secretsLoading, catalogLoading, registryLoading } = appProps;
    const { imageStates, isLoading: imagesLoading } = appProps;
    const { configLoading } = appProps;

    // Determine if any loading is happening
    const isLoading = secretsLoading || catalogLoading || registryLoading || imagesLoading || configLoading;

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const imageProgressTotal = imagesLoading ? 100 : 0;
        const configProgressTotal = configLoading ? 100 : 0;
        const secretsProgressTotal = secretsLoading ? 100 : 0;
        const catalogProgressTotal = catalogLoading ? 100 : 0;
        const registryProgressTotal = registryLoading ? 100 : 0;

        const totalLoadedProgress = imageProgressTotal + configProgressTotal + secretsProgressTotal + catalogProgressTotal + registryProgressTotal;
        const totalPossibleProgress = 500;
        setProgress(Math.round((totalLoadedProgress / totalPossibleProgress) * 100));
    }, [imageStates, configLoading, secretsLoading, catalogLoading, registryLoading]);

    if (!isLoading) return null;

    const getLoadingText = () => {
        if (imagesLoading) return 'Loading required Docker images';
        if (configLoading) return 'Loading configuration';
        if (secretsLoading) return 'Loading secrets';
        if (catalogLoading) return 'Loading catalog';
        if (registryLoading) return 'Loading registry';
        return 'Loading...';
    }

    return (
        <Fade in={isLoading}>
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1200,
            }}>
                <Paper
                    elevation={4}
                    sx={{
                        maxWidth: '500px',
                        width: '90%',
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                        overflow: 'hidden',
                    }}
                >
                    <Stack spacing={2} alignItems="center" width="100%">
                        <Typography variant="h6" fontWeight="medium" textAlign="center">
                            {getLoadingText()}
                        </Typography>

                        <Box position="relative" display="flex" alignItems="center" justifyContent="center" my={1}>
                            <CircularProgress
                                variant="determinate"
                                value={100}
                                size={80}
                                thickness={4}
                                sx={{ color: 'rgba(0, 0, 0, 0.1)' }}
                            />
                            <CircularProgress
                                variant="determinate"
                                value={progress}
                                size={80}
                                thickness={4}
                                sx={{
                                    color: 'primary.main',
                                    position: 'absolute',
                                    left: 0,
                                }}
                            />
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ position: 'absolute' }}
                            >
                                {progress}%
                            </Typography>
                        </Box>

                        <LinearProgress
                            sx={{
                                width: '100%',
                                height: 8,
                                borderRadius: 4,
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    transition: 'transform 0.4s ease'
                                }
                            }}
                            variant="determinate"
                            value={progress}
                        />
                    </Stack>
                </Paper>
            </Box>
        </Fade>
    );
}

export default LoadingState;    