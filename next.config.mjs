import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        unoptimized: true
    },
    webpack(config) {
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            '@': path.resolve('./') // map '@' -> project root
        };
        return config;
    }
};

export default nextConfig;
