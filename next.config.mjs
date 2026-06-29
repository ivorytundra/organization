/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow Google profile avatars served via the OAuth userinfo endpoint.
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
