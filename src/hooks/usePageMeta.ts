import { useEffect } from 'react';
import { ROUTE_SEO_META, SITE_BASE_URL } from '@/src/data/routesMeta';

interface UsePageMetaOptions {
  routePath: string;
  customTitle?: string;
  customDescription?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

function upsertMeta(attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function usePageMeta({ routePath, customTitle, customDescription, faqs }: UsePageMetaOptions) {
  useEffect(() => {
    const meta = ROUTE_SEO_META[routePath];
    const title = customTitle || meta?.title || 'ExamFormTools – Free Photo, Signature & Exam Form Tools';
    const description =
      customDescription ||
      meta?.description ||
      'Prepare your photographs, signatures and documents for Indian government job applications with free online tools.';

    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : SITE_BASE_URL;
    const canonicalUrl = `${origin}${routePath}`;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertCanonical(canonicalUrl);

    // Route-specific JSON-LD
    const existingScript = document.getElementById('route-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    const graph: Record<string, unknown>[] = [
      {
        '@type': meta?.schemaType || 'WebPage',
        name: title,
        description,
        url: canonicalUrl,
      },
    ];

    if (routePath !== '/' && meta?.breadcrumb) {
      graph.push({
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: meta.breadcrumb, item: canonicalUrl },
        ],
      });
    }

    if (faqs && faqs.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      });
    }

    const script = document.createElement('script');
    script.id = 'route-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
    document.head.appendChild(script);
  }, [routePath, customTitle, customDescription, faqs]);
}
