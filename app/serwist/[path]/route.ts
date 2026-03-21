import { spawnSync } from "node:child_process"
import { randomUUID } from "node:crypto"
import { createSerwistRoute } from "@serwist/turbopack"

const gitHead = spawnSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf-8",
}).stdout?.trim()
const revision = gitHead || randomUUID()

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    additionalPrecacheEntries: [{ url: "/~offline", revision }],
    swSrc: "app/sw.ts",
    useNativeEsbuild: true,
  })
