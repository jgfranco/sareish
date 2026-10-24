
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { FaAmazon } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


export default function PageLayout( { children }){

  const { data: session } = useSession();
  const { pathname } = useRouter();

  return (
    <>
      <Head>
        <title>Sareish | Home Decor & Lifestyle by Saraa Franco</title>
        <meta name="description" content="Curated home decor, lifestyle finds, and Amazon favorites by Saraa Franco." />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Saraa Franco",
              "url": "https://sareish.com",
              "sameAs": [
                "https://www.instagram.com/sareish",
                "https://www.tiktok.com/@sareishh",
                "https://www.amazon.com/shop/sareish"
              ]
            })
          }}
        />
      </Head>

      <main>
        <div className="flex flex-col bg-zinc-50 min-h-screen" >
        <div className="flex flex-col mx-auto bg-white w-full sm:w-3/5 min-h-screen">
          {/* nav bar */}
          <nav className='flex flex-row justify-between my-2 mx-5 items-center'>
            <div className='flex gap-0'>
              <div className='p-2 hover:bg-zinc-50 text-zinc-600'>
                <Link href="/">Home</Link>
              </div>
                 <div className='p-2 hover:bg-zinc-50 text-zinc-600' >
                <Link href="/about">About</Link>
              </div> 
              <div className='p-2 hover:bg-zinc-50 text-zinc-600' >
                <Link href="/contact">Contact</Link>
              </div>
              {/*
              <div className='p-2 hover:bg-zinc-50 text-zinc-600' >
                <Link href="/blog">Blog</Link>
              </div>
              */}
            </div>
            <div className='flex gap-3 items-center'>
              <a href="https://www.instagram.com/sareish" rel='me noopener noreferrer' target='_blank'>
                  <Image src="/assets/instagram.svg" width={25} height={25} alt="Instagram"></Image>
              </a>
              <a href="https://www.tiktok.com/@sareishh" rel='me noopener noreferrer' target='_blank'>
                  <Image src="/assets/tiktok.svg"  width={25} height={25} alt="TikTok"></Image>
              </a>
              <a href="https://www.amazon.com/shop/sareish" rel='me noopener noreferrer' target='_blank'
                className='text-zinc-800 hover:text-zinc-600' aria-label="Amazon storefront">
                  <FaAmazon size={23} aria-hidden="true" />
              </a>
          </div>
          </nav>
          {/* admin menu, only when logged in */}
          {session && (
            <nav aria-label='Admin' className='flex gap-1 mx-5 px-1 text-sm border-b border-zinc-100'>
              {[{ href: '/linksEditor', label: 'Links editor' }, { href: '/clicks', label: 'Clicks' }].map(item => (
                <Link key={item.href} href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={`px-2 py-1 hover:bg-zinc-50 ${pathname === item.href ? 'text-rose-700 font-bold' : 'text-zinc-600'}`}>
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
          {/* body of page */}
          <div className="flex flex-col flex-1">
              <div className="text-center py-4">
                  {children}
              </div>
          </div>
          {/* footer */}
          <footer className='p-4 text-zinc-500 text-xs sm:text-sm flex flex-col sm:flex-row sm:justify-between gap-1 text-center sm:text-left'>
            <p>As an Amazon Associate I earn from qualifying purchases.</p>
            <p>© sareish.com</p>
          </footer>
        </div>
    </div>
      </main>
    </>
    
  )
}