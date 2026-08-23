import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

const getSiteUrl = () =>
  (process.env.VITE_SITE_URL || process.env.SITE_URL || process.env.URL || 'https://vebpartner.com').replace(/\/+$/, '');

const siteUrlHtmlPlugin = (): Plugin => ({
  name: 'site-url-html-transform',
  transformIndexHtml(html) {
    return html.replace(/%SITE_URL%/g, getSiteUrl());
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), siteUrlHtmlPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
