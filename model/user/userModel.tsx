import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for a User document
export interface IUser extends Document {
  userName: string;
  email: string;
  password?: string;
}

// Define the schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true, 
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false, // Optional
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Create the User model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
