import { withSerwist } from "@serwist/turbopack";
import { execSync } from "node:child_process";
import { NextConfig } from "next";

function shortCommitSha(): string {
  const sha = process.env.GIT_COMMIT_SHA;
  if (sha) return sha.slice(0, 7);
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  env: {
    GIT_COMMIT_SHA: shortCommitSha(),
  },
};

export default withSerwist(nextConfig);
