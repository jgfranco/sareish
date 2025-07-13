
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';


export default function PageLayout( { children }){

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
        <div className="flex flex-col bg-zinc-50 h-full" >
        <div className="mx-auto bg-white w-full sm:w-3/5 h-full">
          {/* nav bar */}
          <div className='flex flex-row justify-between my-2 mx-5 items-center'>
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
              <div className='p-2 hover:bg-zinc-50 text-zinc-600' >
                <Link href="/blog">Blog</Link>
              </div>
            </div>
            <div className='flex gap-3'>
              <Link href ="http://instagram.com/sareish" rel='me'>
                  <Image src="/assets/instagram.svg" width={25} height={25} alt="instagram logo"></Image>
              </Link>
              <Link href="https://www.tiktok.com/@sareishh" rel='me'>
                  <Image src="/assets/tiktok.svg"  width={25} height={25} alt= "tiktok logo"></Image>
              </Link>    
          </div>
          </div>
          {/* body of page */}
          <div className="flex flex-col justify-evenly">
              <div className="text-center py-4">
                  {children}
              </div>
          </div>
          {/* footer */}
          <div className='fixed bottom-2 right-4 text-right p-4 text-zinc-300'>
            <p>© sareish.com</p>
          </div>
        </div>
    </div>
      </main>
    </>
    
  )
}