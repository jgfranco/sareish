
import Image from 'next/image';


export default function AuthLayout( { children }){
    return (
        <div className="flex min-h-screen bg-rose-200 p-4">
            <div className="m-auto bg-slate-50 rounded-md w-full max-w-md lg:max-w-4xl grid lg:grid-cols-2">
                <div className="hidden lg:flex flex-col justify-center items-center">
                    <Image className='rounded-full self-center' src='/assets/profileSareish.jpeg' width={250} height={250} alt='profile photo'></Image> 
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