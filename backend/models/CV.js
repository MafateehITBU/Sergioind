import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    cv: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
      originalName: { type: String, default: null },
      cvType: { type: String, default: null },
      cvSize: { type: Number, default: null },
    },
    name: { type: String, required: true },
    specialty: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for cv size in human readable format
cvSchema.virtual("formattedCvSize").get(function () {
  if (!this.cv.cvSize) return null;

  const bytes = this.cv.cvSize;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
});

// Virtual for file type category
cvSchema.virtual("cvCategory").get(function () {
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

export default mongoose.model("CV", cvSchema);
