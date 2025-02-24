export const siteConfig = {
	name: 'Simeru UAD - Universitas Ahmad Dahlan',
	description:
		'Simeru UAD - Universitas Ahmad Dahlan adalah website resmi Universitas Ahmad Dahlan yang menyediakan informasi terkini tentang kegiatan, akademik, dan lainnya.',
	keywords: 'Simeru UAD, Universitas Ahmad Dahlan, Informasi Akademik, Sistem Manajemen Ruangan',
	url: new URL('https://simeru.vercel.app'),
	ogImage: new URL('https://simeru.vercel.app/og.png'),
	links: {
		github: new URL('https://github.com/savioruz')
	},
	googleVerification: 'vStJl8xyQB6M8zilVpowvKnr-PdFjGFiiwblfEZyzm0',
	yandexVerification: 'your-yandex-verification-code'
} as const;

export type SiteConfig = typeof siteConfig;
