import Link from 'next/link'
import Layout from '../layouts/pagelayout'
import Head from 'next/head'
export default function Contact() {

    
  
  return (
    <Layout>
      <Head>
        <title>Contact</title>
      </Head>
      <div className='h-screen mt-10'>
        <h1 className='text-zinc-800 text-4xl font-bold py-4'>contact me</h1>
        <p className='text-zinc-500'>for business inquiries send me an email to: </p>
        <a className='cursor-pointer text-zinc-500 hover:text-sky-600'  href="mailto:contact@sareish.com">contact@sareish.com </a>
      </div>
    </Layout>
  )
}