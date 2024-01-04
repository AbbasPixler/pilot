const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  customerNumber:{
    type: String,
    required: true
  },
  streetnumber:{
    type: String,
    required: true
  },
  zipcode:{
    type: String,
    required: true
  },
  owner:{
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  quotations:[{
    type: String,
  }],
  date:{
    type: Number,
    default: Date.now()
  },
  country: {
    type:String,
    required: true
  },
  contact: [{
    contactPerson: {
      type: String,
      required: false
    },
    contactAddress: {
      type: String,
      required: false
    },
    contactZipcode: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: false
    },
    telephone:{
      type: String,
      requried: false
    }
  }],
  modifiedBy:{
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  active: {
    type: Boolean,
    default: false,
  }
}) 
const Customer = mongoose.model("Customer", customerSchema) 
module.exports = Customer