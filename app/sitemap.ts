import { MetadataRoute } from 'next';

// Only public-facing pages — dashboard and admin are login-protected
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://teacher.knowly.uz';

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/apply`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];
}
