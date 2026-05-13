import prisma from './util/prisma';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://store2u.ca';

    const staticPages = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/customer/pages/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/customer/pages/aboutus`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
        { url: `${baseUrl}/customer/pages/contactus`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
        { url: `${baseUrl}/customer/pages/privacypolicy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
        { url: `${baseUrl}/customer/pages/termsandconditions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
        { url: `${baseUrl}/customer/pages/shippingpolicy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
        { url: `${baseUrl}/customer/pages/returnandexchangepolicy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
        { url: `${baseUrl}/customer/pages/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ];

    try {
        const [products, categories, blogs] = await Promise.all([
            prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
            prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
            prisma.blog.findMany({ select: { id: true, updatedAt: true } }),
        ]);

        return [
            ...staticPages,
            ...products.map((p) => ({
                url: `${baseUrl}/customer/pages/products/${p.slug}`,
                lastModified: p.updatedAt,
                changeFrequency: 'weekly',
                priority: 0.8,
            })),
            ...categories.map((c) => ({
                url: `${baseUrl}/customer/pages/category/${c.slug}`,
                lastModified: c.updatedAt,
                changeFrequency: 'monthly',
                priority: 0.7,
            })),
            ...blogs.map((b) => ({
                url: `${baseUrl}/customer/pages/blog/${b.id}`,
                lastModified: b.updatedAt,
                changeFrequency: 'monthly',
                priority: 0.5,
            })),
        ];
    } catch (error) {
        console.error('[Sitemap] DB unavailable during build, returning static pages only:', error.message);
        return staticPages;
    } finally {
        await prisma.$disconnect();
    }
}
