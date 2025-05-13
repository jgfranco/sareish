export default function linksView({ links }) {
    return (
        <div className='flex flex-wrap justify-center '>  
            {links.map(link =>(
                <div className='w-full bg-rose-50 hover:bg-rose-100 py-3 my-3 rounded-full 
                cursor-pointer border-2 border-rose-100 hover:border-rose-200 hover:border-dashed text-rose-950'
                onClick={(e) =>{
                    const newWindow = window.open(link.url, '_blank', 'noopener,noreferrer');
                    if (newWindow) newWindow.opener = null
                    e.preventDefault();
                }}
                key={link.index}> 
                <p>{link.title}</p>
                </div>
            ))}
        </div>
);
}