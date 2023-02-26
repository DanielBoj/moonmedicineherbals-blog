// Dependencies
import mongoose from "mongoose";

// Models imports
import User from "./Users.model.js";

// Create schema
const Schema = mongoose.Schema;

// Create post schema
const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  publicationDate: { type: Date, default: Date.now },
});

// Create model
const Post = mongoose.model("Post", postSchema);

// Export model
export default Post;
