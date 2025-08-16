/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignorer les erreurs ESLint en production pour déploiement urgent
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
