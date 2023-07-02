
import Link from 'next/link';
//mport styles from '../styles/Form.module.css';
import Image from 'next/image';


export default function PageLayout( { children }){

    return (
        <div className="flex flex-col bg-zinc-50 h-screen" >
            <div className="mx-auto bg-white w-full sm:w-3/5 h-screen">
                {/* nav bar */}
                <div className='flex flex-row justify-between my-3 mx-5 items-center'>
                    <div className='flex gap-5'>
                        <Link href="/">Home</Link>
                        <Link href="/about">About</Link>
                    </div>
                    <div className='flex gap-2'>
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
                <div className="right flex flex-col justify-evenly">
                    <div className="text-center py-4">
                        {children}
                    </div>
                </div>
                {/* footer */}
                <div className='absolute bottom-0 text-zinc-300'>
                    © sareish.com
                </div>
            </div>
  
        </div>
    )
}