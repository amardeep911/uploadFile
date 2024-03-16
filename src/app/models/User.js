import mongoose, { Schema, mongo } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);

mongoose.Promise = global.Promise;

const userSchema = new Schema(
  {
    email: String,
    name: String,
    role: String,
    picture: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
