import connectMongo from '../../../database/conn';
import Links from '../../../model/LinkSchema'

export default async function handler(req, res){
    connectMongo().catch(error => res.json({ error: "Connection Failed...!"}))

    // only post method is accepted
    if(req.method === 'POST'){

        if(!req.body) return res.status(404).json({ error: "Don't have form data...!"});
        const { index, title, url, active } = req.body;

        // check duplicate users
        //const checkexisting = await Links.findOne({ email });
        //if(checkexisting) return res.status(422).json({ message: "User Already Exists...!"});

        // hash password
        Links.create({ index, title, url, active }, function(err, data){
            if(err) return res.status(404).json({ err });
            res.status(201).json({ status : true, user: data})
        })
    }
    else if(req.method === 'GET'){
        const links = await Links.find();

        return {
            props:{
                links
            }
        }

    } else{
        res.status(500).json({ message: "HTTP method not valid only POST Accepted"})
    }

} 