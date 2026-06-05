/**
 * Builders de JSON-LD (schema.org) reutilizables.
 *
 * Cada función devuelve un nodo serializable que se inyecta vía la prop
 * `schema` de los layouts (Page → Base → SEO) o directamente desde un
 * componente. Mantener la lógica aquí evita duplicar estructuras y centraliza
 * la resolución de URLs absolutas (requisito de Google para rich results).
 */

const FALLBACK_SITE = 'https://www.gruasdelvalles.com';
const ORG_NAME = 'Grúas del Vallès';

/** Convierte una ruta relativa en URL absoluta usando el site de Astro. */
export function abs(path: string, site?: URL): string {
  return new URL(path, site ?? new URL(FALLBACK_SITE)).href;
}

export interface Crumb {
  label: string;
  href?: string;
}

/** BreadcrumbList: ruta de navegación para rich results. */
export function breadcrumbList(items: Crumb[], site?: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: abs(item.href, site) } : {}),
    })),
  };
}

export interface SpecProperty {
  label: string;
  value: string;
}

/** Product: ficha de grúa con specs técnicas como additionalProperty. */
export function productSchema(
  input: {
    name: string;
    description?: string;
    category?: string;
    brand?: string;
    images?: string[];
    specs?: SpecProperty[];
  },
  site?: URL,
) {
  const { name, description, category, brand, images = [], specs = [] } = input;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    ...(description ? { description } : {}),
    ...(category ? { category } : {}),
    ...(brand ? { brand: { '@type': 'Brand', name: brand } } : {}),
    ...(images.length ? { image: images.map((i) => abs(i, site)) } : {}),
    ...(specs.length
      ? {
          additionalProperty: specs.map((s) => ({
            '@type': 'PropertyValue',
            name: s.label,
            value: s.value,
          })),
        }
      : {}),
  };
}

/** BlogPosting: artículo de noticias con publisher (Organization + logo). */
export function blogPostingSchema(
  input: {
    headline: string;
    description?: string;
    articleBody?: string;
    url: string;
    images?: string[];
  },
  site?: URL,
) {
  const { headline, description, articleBody, url, images = [] } = input;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    ...(description ? { description } : {}),
    ...(articleBody ? { articleBody } : {}),
    ...(images.length ? { image: images.map((i) => abs(i, site)) } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(url, site) },
    author: { '@type': 'Organization', name: ORG_NAME, url: abs('/', site) },
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      logo: { '@type': 'ImageObject', url: abs('/logo.png', site) },
    },
  };
}

/** CollectionPage + ItemList: páginas de listado (flota, maniobras, blog). */
export function collectionPageSchema(
  input: {
    name: string;
    description?: string;
    url: string;
    items: { name: string; url: string }[];
  },
  site?: URL,
) {
  const { name, description, url, items } = input;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    ...(description ? { description } : {}),
    url: abs(url, site),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: abs(it.url, site),
      })),
    },
  };
}
