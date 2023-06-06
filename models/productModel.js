import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.ObjectId, ref: "Category", required: true },
    quantity: { type: Number, required: true },
    picture: { data: Buffer, contentType: String },
    shipping: { type: Boolean },
  },
  { timeStamps: true }
);

export default mongoose.model("Product", productSchema);