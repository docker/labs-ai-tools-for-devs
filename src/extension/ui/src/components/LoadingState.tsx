import { LinearProgress, LinearProgressProps, Box, Typography, Paper, Stack } from "@mui/material";
import { useConfigContext } from "../context/ConfigContext";
import { useEffect, useState } from "react";
import { useCatalogContext } from "../context/CatalogContext";
import { useRequiredImagesContext } from "../context/RequiredImageContext";

const LoadingState = () => {
    const { secretsLoading, catalogLoading, registryLoading } = useCatalogContext();
    const { imageStates, isLoading: imagesLoading } = useRequiredImagesContext();
    const { configLoading } = useConfigContext();

    // Determine if any loading is happening
    const isLoading = secretsLoading || catalogLoading || registryLoading || imagesLoading || configLoading;

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const imageProgressTotal = (() => {
            const total = 5;
            const loaded = Object.values(imageStates).filter(state => state.status === 'success').length;
            return Math.round((loaded / total) * 100);
        })()

        const configProgressTotal = configLoading ? 100 : 0;

        const secretsProgressTotal = secretsLoading ? 100 : 0;

        const catalogProgressTotal = catalogLoading ? 100 : 0;

        const registryProgressTotal = registryLoading ? 100 : 0;

        const totalLoadedProgress = imageProgressTotal + configProgressTotal + secretsProgressTotal + catalogProgressTotal + registryProgressTotal;
        const totalPossibleProgress = 500;
        setProgress(Math.round((totalLoadedProgress / totalPossibleProgress) * 100));
    }, [isLoading]);

    if (!isLoading) return null;

    const getLoadingText = () => {
        if (imagesLoading) return 'Loading required Docker images';
        if (configLoading) return 'Loading configuration';
        if (secretsLoading) return 'Loading secrets';
        if (catalogLoading) return 'Loading catalog';
        if (registryLoading) return 'Loading registry';
    }

    return (
        <Box sx={{ maxWidth: '500px', width: '100%', position: 'sticky', zIndex: 1000, border: '1px solid red', left: '50%', transform: 'translateX(-50%)', top: '10vh', p: 2 }}>
            <Stack direction="column" alignItems="center" width="100%" justifyContent="space-between">
                <LinearProgress sx={{ width: '100%' }} variant="determinate" value={progress} />
                <Typography>
                    {progress}%
                </Typography>
            </Stack>
            {imagesLoading && (
                <Paper elevation={2} sx={{ m: 2, p: 2, maxWidth: '500px', mx: 'auto' }}>
                    <Typography variant="subtitle1" gutterBottom>
                        {getLoadingText()}
                    </Typography>

                    <Stack spacing={1}>
                        {Object.entries(imageStates).map(([imageName, state]) => (
                            <Box key={imageName} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">{imageName}:</Typography>
                                <Typography variant="body2" color={
                                    state.status === 'loading' ? 'primary' :
                                        state.status === 'error' ? 'error' :
                                            state.status === 'success' ? 'success' :
                                                'text.secondary'
                                }>
                                    {state.status}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Paper>
            )}
        </Box>
    );
}

export default LoadingState;    