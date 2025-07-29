import { defineConfig } from 'vite';

export default defineConfig({
    root: './public',         // Your source files live in public/
    build: {
        outDir: '../dist',      // Output build to dist/ at root
        emptyOutDir: true,
        rollupOptions: {
            input: './public/index.html', // Explicit entry point
        },
    },
});
