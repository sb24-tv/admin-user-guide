import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({mode}) => {
    return {
        // Development server configuration
        server: {
            port: 3000, // Specify the development server port
            open: true, // Automatically open the browser
        },
        // Build configuration
        build: {
            outDir: "dist", // Output directory for the production build
            sourcemap: true, // Generate source maps
            minify: mode === "production", // Minify the code in production mode
            chunkSizeWarningLimit: 500, // Adjust the chunk size warning limit as needed
        },
        plugins: [react()],
        // Environment variables
        define: {
            // Define your environment variables here
            "process.env": {
                MODE: JSON.stringify(mode),
                API_URL: JSON.stringify(process.env.API_URL),
            },
        },
    };
});
