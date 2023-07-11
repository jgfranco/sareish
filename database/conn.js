import mongoose from 'mongoose';

const connectMongo = async () => {
    try {
        mongoose.set('strictQuery', true);
        const { connection } = await mongoose.connect(process.env.MONGO_URL);

        if(connection.readyState == 1){
            return Promise.resolve(true)
        }
    } catch (error) {
        return Promise.reject(error)
    }
}

export default connectMongo;