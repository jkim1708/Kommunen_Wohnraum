/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
                port: '', // Leave empty if not using a specific port
                pathname: '/',
            },
        ],
    },
};

export default nextConfig;
