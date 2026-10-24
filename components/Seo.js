import Head from 'next/head';

export default function Seo({ title, description, image, canonical, noindex }) {
  const fullTitle = title ? `${title} | Sareish` : 'Sareish | Home Decor & Lifestyle by Saraa Franco';

  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Sareish" />
      {canonical && <meta property="og:url" content={canonical} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || ''} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
}