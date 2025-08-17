import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Job description cannot exceed 500 characters"],
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time"],
      required: [true, "Employment type is required"],
    },
    location: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      required: [true, "Work Location is required"],
    },
    experienceYears: {
      type: Number,
      required: [true, "Experience Years is required"],
      min: [0, "Experience years cannot be negative"],
    },
    speciality: {
      type: String,
      required: [true, "Speciality is required"],
      trim: true,
      maxlength: [100, "Speciality cannot exceed 100 characters"],
    },
    endDate: {
      type: Date,
      required: [true, "End Date is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);
