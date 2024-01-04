const mongoose = require("mongoose")

const pricingSchema = new mongoose.Schema({
  material:{
    type: String,
    required: true
  },
  serviceGroup:{
    type: String,
    required: true
  },
  materialGroup:{
    type: String,
    requried: false
  },
  service:{
    type: String,
    required: true
  },
  priceVersion:{
    type: String,
    required: true
  },
  company_id:{
    type: String,
    required: false
  },
  price:{
    type: String,
    required: true
  },
  workingTime:{
    type: Number,
    requied: true
  },
  lastModifiedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  lastModifiedDate:{
    type: Number,
    default: Date.now()
  }
}) 
const Pricing = mongoose.model("Pricing", pricingSchema) 
module.exports = Pricing