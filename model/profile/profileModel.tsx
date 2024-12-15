import mongoose, { Document, Schema } from 'mongoose';

// Define an enum for programming subjects
const ProgrammingSubjects = [
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'Ruby',
  'Go',
  'TypeScript',
  'PHP',
  'C#',
  'Swift',
  'Rust',
  'Kotlin',
] as const;

type Subject = typeof ProgrammingSubjects[number]; // TypeScript type for subjects

interface Profile extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Reference to the User model
  fullName: string;
  country: string;
  subjects: Subject[]; // Array of programming subjects
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
    subjects: {
      type: [String],
      enum: ProgrammingSubjects, // Restrict subjects to the predefined list
      required: true,
    },
  },
  { timestamps: true }
);

const ProfileModel = mongoose.models.Profile || mongoose.model<Profile>('Profile', ProfileSchema);

export default ProfileModel;
