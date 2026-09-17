import mongoose from "mongoose";
const connectMongo = () => mongoose.connect(process.env.MONGODB_URL)
export default connectMongo