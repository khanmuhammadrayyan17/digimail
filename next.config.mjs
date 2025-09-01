/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow cross-origin requests in development
  experimental: {
    allowedDevOrigins: ['192.168.18.7', 'localhost']
  }
};

export default nextConfig;
