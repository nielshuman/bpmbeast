/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	output: "standalone",
	images: {
		remotePatterns: [
		  {
			protocol: 'https',
			hostname: 'i.scdn.co',
			port: '',
			pathname: '/image/**'
		  },
		],
	  },	
};

export default nextConfig;
