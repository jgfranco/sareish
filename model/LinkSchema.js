import { Schema, model, models } from 'mongoose';

const linkSchema = new Schema({
    index : String,
    title: String,
    url: String,
    active: String,
    clicks: Number,
    photoUrl: String,
    badge: String // '', 'New' or 'Featured'
})

const Links = models.links || model('links', linkSchema);

export default Links; 