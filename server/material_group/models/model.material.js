const mongoose = require("mongoose")

const materialSchema = new mongoose.Schema({
  material:{
    type: String,
    required: true
  },
  materialGroup:{
    type: String,
    required: true
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
const Material = mongoose.model("Material", materialSchema) 
module.exports = Material