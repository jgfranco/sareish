import PolaroidPhoto from "./polaroidPhoto";

export default function KanbanView({ links }) {
    return (
        <div className='flex flex-col justify-center '>  
        {links.map(link =>(

            <PolaroidPhoto 
            src = "/assets/profileSareish.jpeg"
            alt = "test"
            caption = {link.title}/>

        ))}
        </div>
    );
  }
  