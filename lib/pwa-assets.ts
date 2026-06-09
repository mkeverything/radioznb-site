/** Bump when PWA icons change so caches and re-adds pick up new assets. */
export const PWA_ICON_VERSION = 2

export function pwaIconSrc(path: string): string {
  return `${path}?v=${PWA_ICON_VERSION}`
}
