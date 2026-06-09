import { pwaIconSrc } from "@/lib/pwa-assets"
import type { MetadataRoute } from "next"

const icon192 = pwaIconSrc("/icons/manifest-icon-192.maskable.png")
const icon512 = pwaIconSrc("/icons/manifest-icon-512.maskable.png")

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "радио зимы не будет",
    short_name: "радио знб",
    description: "зе бест рэдио ин зе ворлд.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#fafafa",
    orientation: "any",
    icons: [
      {
        src: icon192,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: icon512,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: icon192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: icon512,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
