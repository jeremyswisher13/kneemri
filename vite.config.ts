/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// Absolute filesystem path resolver. The html2canvas alias is hit by the
// dependency optimizer while pre-bundling jspdf (deep in node_modules); a
// root-relative '/src/...' target gets resolved relative to that importer and
// fails ("Could not load ../../../../src/lib/html2canvas-stub.ts"), so the
// stub target must be an absolute path.
const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      // jsPDF optionally imports html2canvas inside doc.html(), which this app
      // never calls — stub it so the 199KB chunk stays out of the bundle.
      html2canvas: r('./src/lib/html2canvas-stub.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
