
import Link from 'next/link';
import styles from '../styles/Layout.module.css';


export default function PageLayout( { children }){
    return (
        <div className="flex bg-gray-200 just">
            <div className="m-auto bg-slate-50 w-full sm:w-3/5 h-full pt-10">
                <div className='flex flex-row justify-between'>
                    <div className=''>
                        <Link href="/">Home</Link>
                        <Link href="/about">About</Link>
                    </div>
                    <div className='flex flex-row mx-10'>
                        <Link href="http://instagram.com/sareish">instagram</Link>
                        <Link href="https://www.tiktok.com/@sareishh">tiktok</Link>
                    </div>
                </div>
                <div className="right flex flex-col justify-evenly">
                    <div className="text-center py-4">
                        {children}
                    </div>
                </div>
            </div>
  
        </div>
    )
}