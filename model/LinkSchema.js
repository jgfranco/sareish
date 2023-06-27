import { Schema, model, models } from 'mongoose';

const linkSchema = new Schema({
    index : String,
    title: String,
    url: String,
    active: String
})

const Links = models.links || model('links', linkSchema);

export default Links; 