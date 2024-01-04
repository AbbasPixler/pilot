const mongoose = require("mongoose")

const quotationSchema = new mongoose.Schema({
 
    location: {
      type: String,
      required: false
    },
    offerNumber: {
      type: String,
      requried: false
    },
    revision: {
      type: String,
      required: false
    },
    could: {
      type: mongoose.Types.ObjectId,
      ref: "Customer"
    },
    endCustomer: {
      type: mongoose.Types.ObjectId,
      ref: "Customer"
    },
    contact:{
      type: String,
      requried: false
    },
    contact2:{
      type: String,
      requried: false
    },
    currency: {
      type: String,
      required: false
    },
    maintenance: {
      type: String,
      required: false
    },
    priceVersion: {
      type: String,
      reuired: false
    },
    exchangeRate: {
      type: String,
      required: false
    },
    validDate: {
      type: String,
      required: false
    },
    paymentDays: {
      type: String,
      requried: false
    },

  quotations:[{
    name: {
      type: String,
      required: false  // true
    },
    startDate: {
      type:String,
      required:  false  // true
    },
    endDate: {
      type:String,
      required:  false  // true
    },
    deviceGroups:[{
      groupName: {
        type:String,
        required:  false  // true
      },
      devices:[{
        deviceName: {
          type: String,
          required:  false  // true
        },
        serviceGroup:{
          type: String,
          required: false
        },
        itemNumber: {
          type: String,
          required:  false  // true
        },
        quantity:{
          type: Number,
          required:  false,  // true,
          default: 1
        },
        discountPercent: {
          type:Number,
          required: false
        },
        price: {
          type: Number,
          required:  false  // true
        },
        totalDiscountedPrice :{
          type: Number,
          required:  false  // true
        },
        hours: {
          type: Number,
          required:  false  // true
        },
        totalHours: {
          type: Number,
          required:  false  // true
        }
    
      }],
      optionals:[{
        _id:{
          type: String,
          required: false
        },
        optionalName: {
          type: String,
          required:  false  // true
        },
        serviceGroup:{
          type: String,
          required: false
        },
        itemNumber: {
          type: String,
          required:  false  // true
        },
        quantity:{
          type: Number,
          required:  false,  // true,
          default: 1
        },
        discountPercent: {
          type:Number,
          required: false
        },
        price: {
          type: Number,
          required:  false  // true
        },
        totalDiscountedPrice :{
          type: Number,
          required:  false  // true
        },
        hours: {
          type: Number,
          required:  false  // true
        },
        totalHours: {
          type: Number,
          required:  false  // true
        }
    
      }],
    }],
    travelCosts:[{
      _id:{
        type: String,
        required: false
      },
      travelCostName: {
        type: String,
        required:  false  // true
      },
      serviceGroup:{
        type: String,
        required: false
      },
      itemNumber: {
        type: String,
        required:  false  // true
      },
      quantity:{
        type: Number,
        required:  false,  // true,
        default: 1
      },
      discountPercent: {
        type:Number,
        required: false
      },
      price: {
        type: Number,
        required:  false  // true
      },
      totalDiscountedPrice :{
        type: Number,
        required:  false  // true
      },
      hours: {
        type: Number,
        required:  false  // true
      },
      totalHours: {
        type: Number,
        required:  false  // true
      }
  
    }],
    totalPrice:{
      type:Number
    }
  }],

  devices:[{
    deviceName: {
      type: String,
      requried: false
    },
    serviceGroup: {
      type: String,
      requried: false
    },
    serialNumber:{
      type: String,
      requried: false
    },
    equipmentNumber:{
      type: String,
      requried: false
    },
    location:{
      type: String,
      requried: false
    },
    date: {
      type: String,
      requried: false
    }
  }],

  quotePrice:{
    type: Number,
    required: false
  },
  date:{
    type: Number,
    default: Date.now()
  },
  lastModifiedDate: {
    type: Number,
    default: Date.now()
  },
  owner:{
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  lastModifiedBy:{  
    type: String
  }
}) 

const Quotations = mongoose.model("Quotations", quotationSchema) 
module.exports = Quotations  