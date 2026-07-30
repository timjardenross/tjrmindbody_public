import type { Metadata } from 'next';
import { site, absoluteUrl } from './site';
import type { ArticleFrontmatter, ContentEntry, PageFrontmatter } from './content';

interface BuildMetadataArgs {
  title: string;
  description: string;
  path: string;
  seo?: ArticleFrontmatter['seo'] | PageFrontmatter['seo'];
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

export function buildMetadata({
  title,
  description,
  path,
  seo,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  tags,
}: BuildMetadataArgs): Metadata {
  const metaTitle = seo?.title || title;
  const metaDescription = seo?.description || description;
  const canonical = seo?.canonicalUrl || absoluteUrl(path);
  const ogImage = absoluteUrl(seo?.ogImage || image || site.defaultOgImage);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical },
    robots: seo?.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonical,
      siteName: site.name,
      locale: site.locale,
      type,
      images: [{ url: ogImage }],
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
      ...(type === 'article' && tags ? { tags } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: site.twitter,
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
  };
}

export function articleJsonLd(entry: ContentEntry<ArticleFrontmatter>, collectionLabel: string) {
  const url = absoluteUrl(entry.url);
  const image = absoluteUrl(entry.frontmatter.featuredImage || site.defaultOgImage);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.frontmatter.title,
    description: entry.frontmatter.seo?.description || entry.frontmatter.excerpt,
    image: [image],
    datePublished: entry.frontmatter.date,
    dateModified: entry.frontmatter.updated || entry.frontmatter.date,
    author: {
      '@type': 'Person',
      name: entry.frontmatter.author || site.name,
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.png'),
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: collectionLabel,
    keywords: (entry.frontmatter.tags || []).join(', '),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
