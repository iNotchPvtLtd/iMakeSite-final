const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imakesite.s3.eu-north-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;





// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   images: {
//     unoptimized: true,
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'imakesite.s3.eu-north-1.amazonaws.com',
//         pathname: '/**',
//       },
//     ],
//   },
//   assetPrefix: process.env.NODE_ENV === 'production' 
//     ? 'https://imakesite.s3.eu-north-1.amazonaws.com' 
//     : '',
//   trailingSlash: true,
//   skipTrailingSlashRedirect: true,
//   distDir: 'build',
//   reactStrictMode: true,
//   swcMinify: true,
//   compiler: {
//     removeConsole: process.env.NODE_ENV === 'production',
//   }
// };

// module.exports = nextConfig;
  
  