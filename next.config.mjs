/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    trailingSlash: true, // Required for GitHub Pages
    images: {
      unoptimized: true, // Required for static export
    },
    basePath: "/movye-app"
};

export default nextConfig;
