import { Schema, model, models } from "mongoose";
const postSchema = new Schema({
    title: String,
    description: String,
    image: String,
    category: String,
    author: String,

})

const postModel = models.post || model("post", postSchema);
export default postModel