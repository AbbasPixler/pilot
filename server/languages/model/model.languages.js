const mongoose = require("mongoose")

const languagesSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true
  },
  initials: {
    type: String,
    required: true
  },
  translations:{}
}) 
const Languages = mongoose.model("Languages", languagesSchema) 
module.exports = Languages  