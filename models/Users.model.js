// Dependencies
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Models imports
import Post from "./Posts.model.js";

// Password encription factor
const SALT_WORK_FACTOR = 10;

// Create schema
const Schema = mongoose.Schema;

// Create user schema
const userSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  salt: { type: String },
  fullname: { type: String, default: null},
  email: { type: String, required: true, index: { unique: true } },
  creationDate: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["subscriber", "admin"],
    required: true,
    default: "subscriber",
  },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post", default: null }],
});

// IMPORTANT: This is a pre-save hook, it will be executed before the user is saved
// in the database. It will hash the password before saving it.
// WE CAN'T USE ARROW FUNCTIONS HERE BECAUSE WE NEED THE CONTEXT OF THIS
// TO GET THE USER MODEL

// Hash the password before saving the user model
userSchema.pre('save', async function(next) {
  // Get actual user
  const user = this;

  // Check if the password is modified
  if(!user.isModified('password')) return next();

  // Generate the salt and the hash and replace the password
  user.salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  user.password = await bcrypt.hash(user.password, user.salt);

  console.log(user);

  next();
});

// Method to compare the password with the hash
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Get the actual user
  const user = this;

  // Compare the password
  try {
    const isMatch = await bcrypt.compare(candidatePassword, user.password);

    // Return the result
    return isMatch;
  } catch (err) {
    return err;
  }
}

// Create model
const User = mongoose.model("User", userSchema);

// Export model
export default User;
