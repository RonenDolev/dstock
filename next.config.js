/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  output: 'export' // <--- הוסף שורה זו!
}

module.exports = nextConfig
