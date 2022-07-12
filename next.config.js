/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_BASEURL: process.env.API_BASEURL,
  },
};

module.exports = nextConfig;
