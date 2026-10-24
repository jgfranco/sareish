import PolaroidPhoto from "./polaroidPhoto";
import trackClick from "../lib/trackClick";

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
                onClick={() => trackClick(link._id)}
                tiltIndex={i}/>
            </li>
        ))}
        </ul>
    );
}
