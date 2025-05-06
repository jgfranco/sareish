import PolaroidPhoto from "./polaroidPhoto";

export default function PhotoView({ links }) {
    return (
        <div className="grid grid-cols-2 w-full gap-3">  
        {links.map(link =>(
            <PolaroidPhoto 
            key={link.index}
            src = {link.photoUrl}
            alt = {link.title}
            caption = {link.title}/>
        ))}
        </div>
    );
  }
  