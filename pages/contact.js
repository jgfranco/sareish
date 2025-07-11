import Link from 'next/link'
import Layout from '../layouts/pagelayout'
import Seo  from  '../components/Seo'

export default function Contact() {
  return (
    <Layout>
      <Seo
        title="Contact"
        description="Get in touch with Sareish for brand collaborations, business inquiries, or general questions. Reach out via email today."
        canonical="https://sareish.com/contact"
        image="https://sareish.com/assets/profileSareish.jpeg"
      />

      <section className="container mx-auto text-center py-10 w-4/5 sm:w-1/2 h-screen">
        <div className='h-screen mt-10'>
          <h1 className='text-zinc-800 text-4xl font-bold py-4'>contact me</h1>
          <p className='mx-auto text-gray-600'>For business inquiries, partnerships, or collaborations, please reach out via email: </p>
          <Link className='cursor-pointer text-zinc-500 hover:text-sky-600'  href="mailto:contact@sareish.com">contact@sareish.com </Link>
        </div>
      </section>
    </Layout>
  )
}