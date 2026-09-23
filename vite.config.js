import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// tells Vite to understand React (JSX)
export default defineConfig({ plugins: [react()] });
