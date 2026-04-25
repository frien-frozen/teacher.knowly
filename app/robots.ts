import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/apply'],
        disallow: ['/dashboard', '/admin', '/login', '/forgot-password', '/reset-password', '/activate'],
      },
    ],
    sitemap: 'https://teacher.knowly.uz/sitemap.xml',
  };
}
