import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    base: './',  // Relative asset paths — important for GCS hosting
    server: {
        port: 5174,
    },
});
