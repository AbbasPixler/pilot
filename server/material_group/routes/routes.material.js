const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const Material = require("./../models/model.material")
const auth = require("../../middleware/auth")
const nodemailer = require("nodemailer");
const clientURL = process.env.CLIENTURL
const serverURL = process.env.SERVERURL




//---------------------create a Customer----------------------
router.post("/create", auth, async (req, res) => { 
  try {
    const alreadyExist = await Material.find({ material: req.body.materialGroup.material, materialGroup:  req.body.materialGroup.materialGroup})

    if (alreadyExist.length > 0) {
      return res.json({
        status: false,
        message: "Material Group already exist with this material!",
        data: null
      })
    }


    req.body.materialGroup['lastModifiedBy'] = req.user['_id']

    const materialGroup = new Material(req.body.materialGroup)

    await materialGroup.save()

      return res.json({
        status: true,
        message: "material created successfully !",
        data: materialGroup
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
    const materials = await Material.find().populate("lastModifiedBy")
    if(materials.length < 1){
      return res.json({
        status: false,
        message: "No Materials found!",
        data: null
      })
    }
    return res.json({
      status: true,
      message: "Materials fetched successfully!",
      data: materials
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


    await Material.deleteMany({_id: req.body.materialGroups})

    return res.json({
      status: true,
      message: "Materials deleted successfully!",
      data: null
    })

  }catch(err){
    return res.json({
      status: false,
      message: err.message,
      data: null
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