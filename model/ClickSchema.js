import { Schema, model, models } from 'mongoose';

// one document per click on a homepage link, for the editor's stats
const clickSchema = new Schema({
    link: { type: Schema.Types.ObjectId, ref: 'links', index: true },
    at: { type: Date, default: Date.now, index: true },
    source: String, // see lib/clickSource.js
})

const Clicks = models.clicks || model('clicks', clickSchema);

export default Clicks;
