const { Schema, model,mongoose } = require("mongoose");

const slugify=require('slugify')
const productSchema = new Schema({
  name: { type: String, default: "", required: true },
  price: { type: Number, default: 0, required: true },
  quantity: { type: Number, default:0,required:true }, 
  createdAt: { type: String, default: "", required: true },
  productImages: { type: String, default: "" },
  slug: { type: String,required:true,unique:true },
});
productSchema.pre('validate',function(next){
  if(this.name){
    this.slug=slugify(this.name,{lower:true,strict:true})
  }
  next();
});
module.exports = model("product", productSchema);
