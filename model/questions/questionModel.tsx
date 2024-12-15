import mongoose from "mongoose";
import { Schema, Document, model, models } from "mongoose";

interface Question extends Document {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string; // If topic is a string, this is correct
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<Question>(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String], // Array of strings for options
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencing the User model
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Correctly export the model with conditional initialization
const QuestionModel =
  models.Question || model<Question>("Question", QuestionSchema);

export default QuestionModel;
