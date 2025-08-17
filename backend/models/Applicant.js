import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    speciality: {
      type: String,
      required: [true, "Speciality is required"],
      trim: true,
      maxlength: [100, "Speciality cannot exceed 100 characters"],
    },
    experienceYears: {
      type: Number,
      required: [true, "Experience Years is required"],
      min: [0, "Experience years cannot be negative"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: [true, "Gender is required"],
    },
    address: {
      city: {
        type: String,
        enum: [
          "Amman",
          "Zarqa",
          "Irbid",
          "Aqaba",
          "Mafraq",
          "Jerash",
          "Ajloun",
          "Balqa",
          "Madaba",
          "Karak",
          "Tafileh",
          "Maan",
        ],
      },
      street: {
        type: String,
      },
    },
    cv: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
      originalName: { type: String, default: null },
      cvType: { type: String, default: null },
      cvSize: { type: Number, default: null },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for cv size in human readable format
applicantSchema.virtual("formattedCvSize").get(function () {
  if (!this.cv.cvSize) return null;

  const bytes = this.cv.cvSize;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
});

// Virtual for file type category
applicantSchema.virtual("cvCategory").get(function () {
  if (!this.cv.cvType) return "unknown";

  const type = this.cv.cvType.toLowerCase();

  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type.includes("pdf")) return "document";
  if (type.includes("word") || type.includes("document")) return "document";
  if (type.includes("excel") || type.includes("spreadsheet"))
    return "spreadsheet";
  if (type.includes("powerpoint") || type.includes("presentation"))
    return "presentation";
  if (type.includes("zip") || type.includes("rar") || type.includes("archive"))
    return "archive";
  if (type.includes("text/")) return "text";

  return "other";
});

export default mongoose.model("Applicant", applicantSchema);
