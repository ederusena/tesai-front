/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Habilita output standalone para Docker (imagem mínima de produção)
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
