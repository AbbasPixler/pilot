const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const Template = require("../models/models.Template")
const auth = require("../../middleware/auth")


router.post("/create", auth, async(req, res) => {
  try{
    const template = new Template(req.body.template)
    await template.save()

    return res.json({
      message: "Template Created Successfully!",
      data: template,
      status: true
    })
  }catch(err) {
    return res.json({
      message: err.message,
      data: null,
      status: false
    })
  }
})

router.post("/fetchAll", auth, async(req, res) => {
  try{
    const template = await Template.find()

    if(template.length > 0){
      return res.json({
        message: "Template Fetched Successfully!",
        data: template,
        status: true
      })
    }else{
      return res.json({
        message: "No Template Found!",
        data: null,
        status: false
      })
    }
  }catch(err){
    return res.json({
      message: err.message,
      data: null,
      status: false
    })
  }
})


router.put("/update/:id", auth, async(req, res) => {
  try{
    const quote = await Template.find({_id: req.params.id})

    console.log((req.body.quotation.could))

    if(req.body.quotation.could.length > 0){
      req.body.quotation.could = new ObjectID(req.body.quotation.could)
    }
    if(req.body.quotation.endCustomer.length > 0){
      req.body.quotation.endCustomer = new ObjectID(req.body.quotation.endCustomer)
    }
    if(!quote.length > 0){
      return res.json({
        message: "No Quotation Found!",
        data: null,
        status: false
      })
    }
    const Template = await Template.findOneAndUpdate({_id: req.params.id},  req.body.quotation)

      return res.json({
        message: "Quotation Updated Successfully!",
        data: Template,
        status: true
      })
   
  }catch(err){
    console.log(err)
    return res.json({
      message: err.message,
      data: null,
      status: false
    })
  }
})

// ---------------------delte Customer-----------------------------------

router.post("/delete/:id", auth, async(req, res) => {
  try{
    const quotation  = await Template.findById(req.params.id)
    
    if(!quotation){
      return res.json({
        status: false,
        message: "Invalid quotation!",
        data: null
      })      
    }

    const deletedTemplate  = await Template.findByIdAndDelete(req.params.id)

    return res.json({
      status: true,
      message: "Quotation deleted successfully!",
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


module.exports = router