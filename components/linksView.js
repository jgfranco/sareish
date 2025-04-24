export default function linksView({ links }) {

    function onLinkClick(e, link){
        const newWindow = window.open(link.url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null
        e.preventDefault();
    
        //formik.values._id = link._id
        //formik.values.title = link.title;
        //formik.values.url = link.url;
        //link.active === 'true' ? formik.values.active = true : formik.values.active = false;
        //formik.values.index = link.index;
        //onSubmit(formik.values);
    }

    return (
        <div className='flex flex-col justify-center '>  
            {links.map(link =>(
                <div className='w-full bg-rose-50 hover:bg-rose-100 py-3 my-3 rounded-full 
                cursor-pointer border-2 border-rose-100 hover:border-rose-200 hover:border-dashed text-rose-950'
                onClick={(e) =>onLinkClick(e, link)}
                key={link.index}> 
                <p>{link.title}</p>
                </div>
            
            ))}
        </div>

);
}