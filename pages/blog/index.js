import Link from 'next/link';
import Head from 'next/head';
import { getAllPosts } from '../../lib/posts';
import Layout from '../../layouts/pagelayout';
import siteConfig from '../../lib/siteConfig';

export default function Blog({ posts }) {
  const pageTitle = `Blog | ${siteConfig.name}`;
  const pageDescription = 'Read the latest blog posts about home decor and lifestyle by Sareish';
  const pageUrl = `${siteConfig.url}/blog`;

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>

      <main className="max-w-2xl mx-auto p-6 h-screen">
        {/*<h1 className="text-3xl font-bold mb-4">Blog</h1>*/}
        <ul>
          {posts.map((post) => (
            <li key={post.slug} className="mb-6 border-b pb-4">
              <Link
                href={`/blog/${post.slug}`}
                className="text-xl font-semibold text-gray-600 hover:bg-zinc-50 hover:underline">
                {post.frontmatter.title}
              </Link>
              <p className="text-sm text-gray-500">
                {post.frontmatter.date} — {post.frontmatter.author}
              </p>
              {post.frontmatter.excerpt && <p>{post.frontmatter.excerpt}</p>}
              {post.frontmatter.tags?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.frontmatter.tags.map((tag) => (
                    <div key={tag}>
                      <Link
                        href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:underline">
                          {tag}
                      </Link>
                      </div> 
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();
  return {
    props: {
      posts,
    },
  };
}
