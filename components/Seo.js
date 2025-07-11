import Head from 'next/head';

export default function Seo({ title, description, image, canonical }) {
  const fullTitle = title ? `${title} | Sareish` : 'Sareish | Home Decor & Lifestyle by Saraa Franco';

  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || ''} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}