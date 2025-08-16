export type Crumb = { name: string; item: string };

export function generateBreadcrumbListJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: c.name,
      item: c.item,
    })),
  };
}


