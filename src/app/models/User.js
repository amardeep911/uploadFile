import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);

mongoose.Promise = global.Promise;

// Define schema for files
const fileSchema = new Schema({
  id: String,
  fileType: String,
  fileUrl: String,
  // Add any other properties you need for files
});

// Define schema for users
const userSchema = new Schema(
  {
    email: String,
    name: String,
    role: String,
    picture: String,
    files: [fileSchema], // Embed files array within users
  },
  {
    timestamps: true,
  }
);

// Define User model
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Define File model
const File = mongoose.models.File || mongoose.model("File", fileSchema);

export { User, File };
