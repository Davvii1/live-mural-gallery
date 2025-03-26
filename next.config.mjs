let userConfig = undefined;
try {
  userConfig = await import("./v0-user-next.config");
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  async rewrites() {
    const baseRewrites = [
      {
        source: "/api/files", // Ruta original en tu aplicación
        destination: "https://github-nfhau4uu-xnhgz7gd.vercel.app/api/files", // La URL de destino
      },
    ];

    const userRewrites = userConfig?.rewrites ? await userConfig.rewrites() : [];
    return [...baseRewrites, ...userRewrites];
  },
};

await mergeConfig(nextConfig, userConfig);

async function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) return;

  for (const key in userConfig) {
    if (typeof nextConfig[key] === "function") {
      const baseValue = await nextConfig[key]();
      const userValue = await userConfig[key]();
      nextConfig[key] = async () => [...baseValue, ...userValue];
    } else if (typeof nextConfig[key] === "object" && !Array.isArray(nextConfig[key])) {
      nextConfig[key] = { ...nextConfig[key], ...userConfig[key] };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

export default nextConfig;
