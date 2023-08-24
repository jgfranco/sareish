
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineHome } from 'react-icons/hi'

export default function PageLayout( { children }){

  return (
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
            </div>
            <div className='flex gap-3'>
              <Link href ="http://instagram.com/sareish">
                <a>
                  <Image src="/assets/instagram.svg" width={25} height={25}></Image>
                </a>
              </Link>
              <Link href="https://www.tiktok.com/@sareishh">
                <a>
                  <Image src="/assets/tiktok.svg"  width={25} height={25}></Image>
                </a>
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
          <div className='position-fixed text-center p-4 bottom-2 text-zinc-300'>
            <p>© sareish.com</p>
          </div>
        </div>
    </div>
  )
}