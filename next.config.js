/** @type {import('next').Next  } */
const nextConfig = {
  reactStrictMode: true,
  //swcMinify: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
};

module.exports = nextConfig
