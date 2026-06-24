/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 노션에 올린 이미지(팀 로고 등)를 외부에서 불러오기 위한 설정
    remotePatterns: [
      { protocol: "https", hostname: "**.notion.so" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.notion-static.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

module.exports = nextConfig;
