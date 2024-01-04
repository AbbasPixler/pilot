const express = require("express")
const router = express.Router()
const Pricing = require("./../models/model.pricing")
const auth = require("../../middleware/auth")




//---------------------create a Customer----------------------
router.post("/create", auth, async (req, res) => { 
  try {
    const alreadyExist = await Pricing.find({ material: req.body.pricing.material, priceVersion:  req.body.pricing.priceVersion})

    if (alreadyExist.length > 0) {
      return res.json({
        status: false,
        message: "Pricing already exist with this material!",
        data: null
      })
    }


    req.body.pricing['lastModifiedBy'] = req.user['_id']

    const prices = req.body.pricing['price']
    const workingTime = req.body.pricing['workingTime']

    if(prices.includes(",")){
      const priceArray = prices.split(",")
      priceArray[0] = priceArray[0] + "."
      const newP = priceArray.join("")
      req.body.pricing['price'] = newP
    }

    if(workingTime.includes(",")){
      const priceArray = prices.split(",")
      priceArray[0] = priceArray[0] + "."
      const newP = priceArray.join("")
      req.body.pricing['workingTime'] = newP
    }

    

    const pricing = new Pricing(req.body.pricing)

    await pricing.save()

      return res.json({
        status: true,
        message: "pricing created successfully !",
        data: pricing
      })   

  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
      data: null
    })

  }

})

// // --------------------fetch Customers-----------------------------
router.post("/fetchAll", auth, async(req, res) => {
  try{
    const pricings = await Pricing.find().populate("lastModifiedBy")
    if(pricings.length < 1){
      return res.json({
        status: false,
        message: "No Pricinga found!",
        data: null
      })
    }
    return res.json({
      status: true,
      message: "pricings fetched successfully!",
      data: pricings
    })
  }catch(err){
    return res.json({
      status: false,
      message: err.message,
      data: null
    })
  }
})

// ---------------------delte Customer-----------------------------------

router.post("/deleteMany", auth, async(req, res) => {
  try{


    await Pricing.deleteMany({_id: req.body.pricings})

    const pricings = await Pricing.find().populate("lastModifiedBy")

    // if(pricings.length < 1){
    //   return res.json({
    //     status: false,
    //     message: "No Pricinga found!",
    //     data: null
    //   })
    // }

    return res.json({
      status: true,
      message: "Pricings deleted successfully!",
      data: pricings
    })

  }catch(err){
    return res.json({
      status: false,
      message: err.message,
      data: null
    })
  }
})

// ---------------------update------------------------------------------

router.put("/updatePricingMaterialGroups", auth, async(req, res) => {
  try{
  await Pricing.findByIdAndUpdate(req.body.pricing['_id'], {materialGroup: req.body.pricing['materialGroup']})
  return res.json({
    data: null,
    status: true,
    message: "Pricing Updated Successfully"
  })
}catch(err){
  return res.json({
    data: null,
    status: false,
    message: err.message
})
}
})

// // --------------------fetch Customers-----------------------------
// router.post("/fetch/:id", auth, async(req, res) => {
//   try{
//     const customer = await Customer.findById(req.params.id).populate("owner").populate("modifiedBy")
//     if(customer.length < 1){
//       return res.json({
//         status: false,
//         message: "No Customer found!",
//         data: null
//       })
//     }
//     return res.json({
//       status: true,
//       message: "Customer fetched successfully!",
//       data: customer
//     })
//   }catch(err){
//     return res.json({
//       status: false,
//       message: err.message,
//       data: null
//     })
//   }
// })

// // ---------------------edit Customer profile data-------------------------
// router.put("/update/:id", auth, async(req, res) => {
//   try{

//     const customer = await Customer.findById(req.params.id)    

//     if(!customer){
//       return res.json({
//         status: false,
//         message: "Invalid Customer!",
//         data: null
//       })      
//     }

//     const checkName = await Customer.findOne({name: req.body.customer.name.toLowerCase()})

//     if(checkName && (checkName['_id'] != req.params.id) && (checkName['name'] == req.body.customer.name.toLowerCase())){
//       return res.json({
//         status: false,
//         message: "This name is already taken!",
//         data: null
//       }) 
//     }

//     const updateCustomer = {
//       name: req.body.customer.name.toLowerCase(),
//       country: req.body.customer.country,
//       zipcode: req.body.customer.zipcode,
//       streetnumber: req.body.customer.streetnumber,
//       country: req.body.customer.country,
//       modifiedBy: req.user._id,
//       date: Date.now()
//     }
  
//     const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, updateCustomer)
//       return res.json({
//         status: true,
//         data: updatedCustomer,
//         message: "Customer Profile data updated successfully!"
//       })

//   }catch(err){
//     console.log(err)
//     return res.json({
//       status: false,
//       message: err.message,
//       data: null
//     })  
//   }
// })









module.exports = router