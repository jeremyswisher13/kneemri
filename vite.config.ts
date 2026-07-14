/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Absolute filesystem path resolver. The html2canvas alias is hit by the
// dependency optimizer while pre-bundling jspdf (deep in node_modules); a
// root-relative '/src/...' target gets resolved relative to that importer and
// fails ("Could not load ../../../../src/lib/html2canvas-stub.ts"), so the
// stub target must be an absolute path.
const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))
const packageVersion = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version as string
const buildId = process.env.VITE_APP_BUILD || new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(`web-${packageVersion}+${buildId}`),
  },
  resolve: {
    alias: {
      '@': '/src',
      // jsPDF optionally imports html2canvas inside doc.html(), which this app
      // never calls — stub it so the 199KB chunk stays out of the bundle.
      html2canvas: r('./src/lib/html2canvas-stub.ts'),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 20_000,
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
              priority: 40,
            },
          ],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
