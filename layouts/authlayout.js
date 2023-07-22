
import styles from '../styles/Layout.module.css';
import Image from 'next/image';


export default function AuthLayout( { children }){
    return (
        <div className="flex h-screen bg-rose-200">
            <div className="m-auto bg-slate-50 rounded-md w-3/5 h-3/4 grid lg:grid-cols-2">
                <div className="flex flex-col justify-center items-center">
                    <Image className='rounded-full self-center' src='/assets/profileSareish.jpeg' width={250} height={250}></Image> 
                </div>
                <div className="flex flex-col right justify-evenly">
                    <div className="text-center py-10">
                        {children}
                    </div>
                </div>
            </div>
  
        </div>
    )
}