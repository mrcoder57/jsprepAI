import mongoose, { Document, Schema } from 'mongoose';

interface Profile extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Reference to the User model
  fullName: string;
  country: string;
  topics: string[]; // Array to store the topics
}

const ProfileSchema = new Schema<Profile>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencing the User model
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    topics: {
      type: [String], // Array of strings for topics
      default: [],
    },
  },
  { timestamps: true }
);

const ProfileModel = mongoose.models.Profile || mongoose.model<Profile>('Profile', ProfileSchema);

export default ProfileModel;
