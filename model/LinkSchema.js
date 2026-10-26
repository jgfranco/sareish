import { Schema, model, models } from 'mongoose';

const linkSchema = new Schema({
    index : String,
    title: String,
    url: String,
    active: String,
    clicks: Number,
    photoUrl: String,
    badge: String, // '', 'New' or 'Featured'
    startAt: Date, // shown on the homepage from this time, if set
    endAt: Date, // hidden from the homepage after this time, if set
    check: { status: String, code: Number, at: Date } // last broken link check: 'ok', 'broken' or 'unknown'
})

const Links = models.links || model('links', linkSchema);

export default Links; 