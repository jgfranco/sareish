import { getAllPosts } from '../../../lib/posts';
import Layout from '../../../layouts/pagelayout';
import Head from 'next/head';
import Link from 'next/link';


export default function TagPage({ tag, posts }) {
  return (
    <Layout>
      <Head>
        <title>Posts tagged {tag}</title>
        <meta name="description" content={`All blog posts tagged with ${tag}`} />
      </Head>

      <main className="max-w-2xl mx-auto p-6 h-screen">
        <h3 className="text-3xl font-bold mb-4">Tag: {tag}</h3>
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.slug} className="mb-6 border-b pb-4">
                <a href={`/blog/${post.slug}`} className="text-xl font-semibold text-zinc-600 hover:underline">
                  {post.frontmatter.title}
                </a>
                <p className="text-sm text-zinc-500">
                  {post.frontmatter.date} — {post.frontmatter.author}
                </p>
              </li>
            ))}
          </ul>
        )}
        <Link href="/blog" className="text-zinc-600 hover:underline">
            ← Back to All Posts
        </Link>
      </main>
    </Layout>
  );
}

export async function getStaticPaths() {
  const posts = getAllPosts();
  const tagsSet = new Set();

  posts.forEach((post) => {
    post.frontmatter.tags?.forEach((tag) => tagsSet.add(tag.toLowerCase()));
  });

  const paths = Array.from(tagsSet).map((tag) => ({
    params: { tag },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const allPosts = getAllPosts();
  const tag = params.tag.toLowerCase();

  const filteredPosts = allPosts.filter((post) =>
    post.frontmatter.tags?.some((t) => t.toLowerCase() === tag)
  );

  return {
    props: {
      tag,
      posts: filteredPosts,
    },
  };
}
