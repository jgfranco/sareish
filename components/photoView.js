import PolaroidPhoto from "./polaroidPhoto";

export default function PhotoView({ links }) {
    // only links with a photo can be shown as a polaroid
    const photoLinks = links.filter(link => link.photoUrl);

    return (
        <ul className="grid grid-cols-2 w-full gap-3" >
        {photoLinks.map((link, i) =>(
            <li key={link._id} className="flex justify-center">
                <PolaroidPhoto
                src = {link.photoUrl}
                alt = {link.title}
                caption = {link.title}
                url={link.url}
                tiltIndex={i}/>
            </li>
        ))}
        </ul>
    );
}
