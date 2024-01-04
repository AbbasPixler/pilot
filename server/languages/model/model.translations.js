const mongoose = require("mongoose")

const translationsSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true
  },
  initials: {
    type: String,
    required: true
  }
}) 
const Translations = mongoose.model("Translations", translationsSchema) 
module.exports = Translations  