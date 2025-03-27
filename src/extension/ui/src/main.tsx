import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { DockerMuiV6ThemeProvider } from "@docker/docker-mui-theme";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { App } from './App';

// Configure query client with default settings to reduce spinners
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep data in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Treat data as fresh for 30 seconds
      staleTime: 30 * 1000,
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Retry failed queries 3 times
      retry: 3
    }
  }
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <DockerMuiV6ThemeProvider>
        <App />
      </DockerMuiV6ThemeProvider>
      {localStorage.getItem('ENABLE_REACT_QUERY_DEVTOOLS') && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode >
);
