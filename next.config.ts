import { withSerwist } from "@serwist/turbopack";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
};

export default withSerwist(nextConfig);
