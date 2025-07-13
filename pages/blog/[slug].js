import { getPostBySlug, getPostSlugs } from '../../lib/posts';
import { remark } from 'remark';
import html from 'remark-html';
import Layout from '../../layouts/pagelayout';
import Head from 'next/head';
import siteConfig from '../../lib/siteConfig';
import { useState } from 'react';
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaLink } from 'react-icons/fa';
import Link from 'next/link';

export default function Post({ slug, frontmatter, content }) {

    const {
        title,
        date,
        excerpt,
        author = siteConfig.defaultAuthor,
        image,
        tags
    } = frontmatter;

    const postUrl = `${siteConfig.url}/blog/${slug}`;
    const imageUrl = image ? `${siteConfig.url}${image}` : null;

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
    navigator.clipboard.writeText(postUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // hide after 2 seconds
    });
    };
  return (
    <Layout>
        <Head>
            <title>{title} | {siteConfig.name}</title>
            <meta name="description" content={excerpt} />
            <meta name="author" content={author} />
            <link rel="canonical" href={postUrl} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={excerpt} />
            <meta property="og:url" content={postUrl} />
            <meta property="og:type" content="article" />
            {imageUrl && <meta property="og:image" content={imageUrl} />}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={excerpt} />
            {imageUrl && <meta name="twitter:image" content={imageUrl} />}

            {/* Structured Data */}
            <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: title,
                datePublished: date,
                author: {
                    "@type": "Person",
                    name: author,
                },
                description: excerpt,
                image: imageUrl,
                url: postUrl,
                }),
            }}
            />
        </Head>
        <article className="prose mx-auto max-w-2xl p-6 h-screen">
            <h2>{title}</h2>
            <p className="text-sm text-gray-500">
                {date} 
            </p>
            <p className="text-sm text-gray-500">
                — by {author}
            </p>

            {image && (
                <img src={image} alt={title} className="w-full my-4 rounded-xl" />
            )}

            <div dangerouslySetInnerHTML={{ __html: content }} />

            {tags?.length && (
                <div className="mt-6">
                    <p className="text-sm text-gray-600">Tags:</p>
                    <ul className="flex flex-wrap gap-2 mt-1">
                    {tags.map((tag) => (
                        <li key={tag}>
                        <Link
                            href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                            className="text-xs bg-gray-100 text-blue-600 px-2 py-1 rounded hover:underline"
                        >
                            {tag}
                        </Link>
                        </li>
                    ))}
                    </ul>
                </div>
            )}
            {/* Social Share Buttons */}
            <div className="mt-10 border-t pt-6 p-4">
                <p className="text-sm text-gray-600 mb-2">Share this post:</p>
                <div className="flex gap-4 items-center text-gray-600">
                    <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Twitter"
                    className="hover:text-blue-500 transition"
                    >
                    <FaTwitter size={20} />
                    </a>
                    <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    className="hover:text-blue-700 transition"
                    >
                    <FaFacebookF size={20} />
                    </a>
                    <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="hover:text-blue-600 transition"
                    >
                    <FaLinkedinIn size={20} />
                    </a>
                    <button
                    onClick={handleCopy}
                    aria-label="Copy Link"
                    className="hover:text-black transition focus:outline-none"
                    >
                    <FaLink size={20} />
                    {copied && <span className="ml-2 text-xs text-green-600">Copied!</span>}
                    </button>
                </div>
            </div>
        </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const slugs = getPostSlugs();
  const paths = slugs.map(slug => ({
    params: { slug: slug.replace(/\.md$/, '') },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();

  return {
    props: {
        slug: post.slug,
        frontmatter: post.frontmatter,
        content: contentHtml,
    },
  };
}
