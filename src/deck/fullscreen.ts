/**
 * Full screen, across three browsers that disagree about it.
 *
 * Desktop Safari and iPad Safari only have the webkit-prefixed API; iPhone
 * Safari has no Fullscreen API at all, which is not an error to report — on
 * iPhone the answer is "Add to Home Screen", and the web-app meta tags in
 * index.html make that open without browser chrome. So every call here
 * fails silently and the deck carries on at whatever size it has.
 */

type FsDoc = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => void | Promise<void>
}

type FsEl = HTMLElement & {
  webkitRequestFullscreen?: () => void | Promise<void>
}

export function fullscreenElement(): Element | null {
  const d = document as FsDoc
  return d.fullscreenElement ?? d.webkitFullscreenElement ?? null
}

export function supportsFullscreen(): boolean {
  const el = document.documentElement as FsEl
  return typeof el.requestFullscreen === 'function' ||
    typeof el.webkitRequestFullscreen === 'function'
}

export function toggleFullscreen(): void {
  const d = document as FsDoc
  const el = document.documentElement as FsEl
  try {
    if (fullscreenElement()) {
      if (typeof d.exitFullscreen === 'function') void d.exitFullscreen().catch(() => {})
      else d.webkitExitFullscreen?.()
      return
    }
    if (typeof el.requestFullscreen === 'function') {
      void Promise.resolve(el.requestFullscreen()).catch(() => {})
      return
    }
    el.webkitRequestFullscreen?.()
  } catch {
    /* iPhone Safari, or a frame that disallows it */
  }
}
