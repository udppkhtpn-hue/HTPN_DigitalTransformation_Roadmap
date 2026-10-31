import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { join, normalize } from 'node:path'

/**
 * Serve media/ from the dev server.
 *
 * The reel deliberately lives outside public/ and is copied into the build
 * afterwards (see scripts/copy-media.mjs), so under `npm run dev` its URL
 * fell through to the app's HTML page and the video could never play in the
 * preview. This answers it from media/ instead, with the Range support a
 * <video> element needs to start playing. Dev only; builds are untouched.
 */
function serveMedia(base: string): Plugin {
  return {
    name: 'serve-media',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url ?? '').split('?')[0])
        if (!url.startsWith(base)) return next()
        const file = normalize(join('media', url.slice(base.length)))
        if (file.startsWith('..') || !existsSync(file) || !statSync(file).isFile()) return next()

        const size = statSync(file).size
        const type = file.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'
        const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? '')
        if (range) {
          const start = range[1] ? Number(range[1]) : 0
          const end = range[2] ? Number(range[2]) : size - 1
          res.writeHead(206, {
            'Content-Type': type,
            'Accept-Ranges': 'bytes',
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Content-Length': end - start + 1,
          })
          createReadStream(file, { start, end }).pipe(res)
        } else {
          res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Length': size })
          createReadStream(file).pipe(res)
        }
      })
    },
  }
}

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
    plugins: [react(), serveMedia('/HTPN_DigitalTransformation_Roadmap/'), ...(single ? [viteSingleFile()] : [])],
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
