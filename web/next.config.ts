import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const imageRemotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "http", hostname: "localhost", port: "3000", pathname: "/api/**" },
];

if (process.env.NEXT_PUBLIC_SERVER_URL) {
  try {
    const u = new URL(process.env.NEXT_PUBLIC_SERVER_URL);
    imageRemotePatterns.push({
      protocol: u.protocol === "https:" ? "https" : "http",
      hostname: u.hostname,
      pathname: "/api/**",
      ...(u.port ? { port: u.port } : {}),
    });
  } catch {
    /* ignore invalid URL */
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageRemotePatterns,
  },
  async redirects() {
    return [
      { source: "/apie", destination: "/about", permanent: true },
      { source: "/sidrai", destination: "/ciders", permanent: true },
      { source: "/parduotuve", destination: "/shop", permanent: true },
      { source: "/krepselis", destination: "/cart", permanent: true },
      { source: "/privatumas", destination: "/privacy", permanent: true },
      { source: "/salygos", destination: "/terms", permanent: true },
      { source: "/pristatymas", destination: "/shipping", permanent: true },
      { source: "/kontaktai", destination: "/contact", permanent: true },
    ];
  },
};

export default withPayload(nextConfig);
