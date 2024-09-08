import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path-browserify';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'three': path.resolve('./node_modules/three')  // Указывает на одну версию three.js
    }
  }
})
