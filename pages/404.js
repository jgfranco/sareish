import Link from 'next/link';
import Image from 'next/image';
import Layout from '../layouts/pagelayout';
import Seo from '../components/Seo';

export default function NotFound() {
    return (
      <Layout>
        <Seo title="Page not found" noindex />
        <section className="container mx-auto text-center py-10 w-4/5 sm:w-1/2">
          <div className="flex justify-center mb-8">
            <Image className='rounded-full' src='/assets/profileSareish.jpeg' alt='' width={96} height={96} />
          </div>
          <h1 className='text-gray-800 text-3xl font-bold py-4'>this page has moved out</h1>
          <p className='mx-auto text-gray-600'>The link you followed may be old, or the page no longer exists.</p>
          <Link href="/" className='inline-block mt-8 px-6 py-3 rounded-full bg-rose-50 hover:bg-rose-100 border-2 border-rose-100 hover:border-rose-200 hover:border-dashed text-rose-950'>
            Back to my links
          </Link>
        </section>
      </Layout>
    )
}
