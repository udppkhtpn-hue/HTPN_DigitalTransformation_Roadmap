import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

/**
 * Two targets from one source.
 *
 *   build         → dist/        for GitHub Pages, under the repo path
 *   build:single  → dist-single/ one self-contained HTML file for the venue
 *
 * The single-file build is the one that gets presented: no network, no host
 * page competing for keystrokes, real fullscreen. Pages is for sharing.
 */
export default defineConfig(({ mode }) => {
  const single = mode === 'single'

  return {
    base: single ? './' : '/HTPN_DigitalTransformation_Roadmap/',
    plugins: [react(), ...(single ? [viteSingleFile()] : [])],
    build: {
      outDir: single ? 'dist-single' : 'dist',
      emptyOutDir: true,
      target: 'es2022',
      cssCodeSplit: !single,
      // Inline everything — fonts and images included — for the offline file.
      assetsInlineLimit: single ? Number.MAX_SAFE_INTEGER : 4096,
      rollupOptions: single
        ? { output: { inlineDynamicImports: true } }
        : undefined,
      chunkSizeWarningLimit: 3000,
    },
  }
})
