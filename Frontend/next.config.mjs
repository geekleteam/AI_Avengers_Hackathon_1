/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        KIND_CALLBACK_URL: 'https://solution-mapper-oidyekq0f-veereshs-projects-fe30e757.vercel.app/api/auth/kinde_callback',
        KIND_CLIENT_ID: '5f48e14423c042c7a51aa001e975eb01',
        // Add other necessary environment variables
    },
    images: {
        domains: ['gravatar.com', 'lh3.googleusercontent.com']
    }
};

export default nextConfig;
