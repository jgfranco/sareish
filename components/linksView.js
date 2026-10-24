import trackClick from '../lib/trackClick';

export default function linksView({ links }) {
    return (
        <ul className='flex flex-wrap justify-center'>
            {links.map(link =>(
                <li key={link._id} className='w-full my-3'>
                    <a
                        href={link.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        onClick={() => trackClick(link._id)}
                        className='block w-full bg-rose-50 hover:bg-rose-100 py-3 rounded-full
                        border-2 border-rose-100 hover:border-rose-200 hover:border-dashed text-rose-950
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400'>
                        {link.title}
                    </a>
                </li>
            ))}
        </ul>
);
}
