import Layout from '../layouts/pagelayout'
import Head from 'next/head'
import Image from 'next/image';

export default function About() {
    return (
      <Layout>
        <Head>
          <title>About Me</title>
        </Head>
        {/* {session ? User({ session, handleSignOut }) : Guest( {links} )} */}
        <section className="container mx-auto text-center py-10 w-4/5 sm:w-1/2 h-screen">
          <div className="mb-8"> 
            <Image className='rounded-full' src='/assets/profileSareish.jpeg' alt='profile picture' width={120} height={120}></Image>
          </div>
          <div>
                <h1 className='text-gray-800 text-4xl font-bold py-4'>about me</h1>
                <p className='mx-auto text-gray-600'> I&apos;ve always been passionate about bringing beauty and inspiration into people&apos;s lives. 
                I find joy in styling spaces and encouraging others to embrace the romance of life by creating beautiful environments. 
                Whether it&apos;s arranging furniture, choosing color palettes, or adding personal touches that make a space truly unique, 
                I believe in the transformative power of a well-curated living space.</p>
                <br/>
                <p className='mx-auto text-gray-600'>Beyond that, I also have a knack for discovering and sharing products 
                that enhance both my own and my audience&apos;s day-to-day lives. Collaborating with brands that align with my values, 
                I aim to introduce solutions that elevate comfort and style.</p>
          </div>
          </section>
      </Layout>
    )
  }