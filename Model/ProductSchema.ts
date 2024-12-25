import { Schema,model } from "mongoose";
import { ProductSchemaTypes } from "../types/productsSchemaTypes";

const productSchema = new Schema<ProductSchemaTypes>(
  {
    userId:{
type:String,
required:true
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    size: [{ type: String }], 
    otherImages: [{ type: String }],
    category: {
      type: String,
      required: true,
    },
    reviews: [
      {
        userId: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
      },
    ], 
    discount: {
      type: Number,
      default: 0,
    },
   
  },
  { timestamps: true } 
);

const products=model("products",productSchema);

export {products};
