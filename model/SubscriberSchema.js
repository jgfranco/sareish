import { Schema, model, models } from 'mongoose';

// email signups from the homepage
const subscriberSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    at: { type: Date, default: Date.now },
})

const Subscribers = models.subscribers || model('subscribers', subscriberSchema);

export default Subscribers;
