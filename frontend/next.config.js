/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Ensure static files are properly handled
    experimental: {
        outputFileTracingRoot: undefined,
    },
}

module.exports = nextConfig
