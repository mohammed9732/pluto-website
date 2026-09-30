/** @type {import('next').NextConfig} */
const immutable = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }];

const nextConfig = {
  async redirects() {
    return [{ source: '/', destination: '/en', permanent: false }];
  },
  async headers() {
    return [
      { source: '/sequence-1/:file*', headers: immutable },
      { source: '/sequence-2/:file*', headers: immutable },
      { source: '/sequence-1-hd/:file*', headers: immutable },
      { source: '/sequence-2-hd/:file*', headers: immutable },
      { source: '/globe-loop-1080.mp4', headers: immutable },
    ];
  },
};

export default nextConfig;
