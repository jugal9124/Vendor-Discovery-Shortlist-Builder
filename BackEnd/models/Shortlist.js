import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
  name: String,
  website: String,
  pricingUrl: String,
  priceRange: String,
  summary: String,
  featureMatches: [
    {
      requirement: String,
      match: { type: String, enum: ["full", "partial", "none"] },
      evidence: String,
      evidenceUrl: String,
    },
  ],
  risks: [String],
  score: Number,
  scrapedSuccessfully: Boolean,
});

const ShortlistSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    need: { type: String, required: true },
    requirements: [
      {
        text: String,
        weight: { type: Number, default: 1, min: 1, max: 3 },
      },
    ],
    excludedVendors: [String],
    vendors: [VendorSchema],
    markdownExport: String,
    status: {
      type: String,
      enum: ["processing", "done", "error"],
      default: "processing",
    },
    errorMessage: String,
  },
  { timestamps: true }
);

ShortlistSchema.statics.enforceLimit = async function (sessionId, limit = 5) {
  const count = await this.countDocuments({ sessionId });
  if (count > limit) {
    const oldest = await this.find({ sessionId })
      .sort({ createdAt: 1 })
      .limit(count - limit)
      .select("_id");
    await this.deleteMany({ _id: { $in: oldest.map((d) => d._id) } });
  }
};

export default mongoose.model("Shortlist", ShortlistSchema);
