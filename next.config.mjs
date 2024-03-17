import { Protocol } from "@aws-sdk/client-s3";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "amardeep911-s3-nextjs.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
