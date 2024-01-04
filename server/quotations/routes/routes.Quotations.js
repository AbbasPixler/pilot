const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const Quotations = require("../models/model.Quotations")
const auth = require("../../middleware/auth")
// const { default: puppeteer } = require('puppeteer');


router.post("/create", auth, async(req, res) => {
  try{
    const quotation = new Quotations(req.body.quotation)
    await quotation.save()

    return res.json({
      message: "Quotation Create Successfully!",
      data: quotation,
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
    const quotations = await Quotations.find().populate('could').populate('endCustomer').populate('owner')

    if(quotations.length > 0){
      return res.json({
        message: "Quotations Fetched Successfully!",
        data: quotations,
        status: true
      })
    }else{
      return res.json({
        message: "No Quotations Found!",
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
    
    const quote = await Quotations.find({_id: req.params.id})

    if(!quote.length > 0){
      return res.json({
        message: "No Quotation Found!",
        data: null,
        status: false
      })
    }
    const quotations = await Quotations.findOneAndUpdate({_id: req.params.id},  req.body.quotation)

      return res.json({
        message: "Quotation Updated Successfully!",
        data: quotations,
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
    const quotation  = await Quotations.findById(req.params.id)
    
    if(!quotation){
      return res.json({
        status: false,
        message: "Invalid quotation!",
        data: null
      })      
    }

    const deletedQuotations  = await Quotations.findByIdAndDelete(req.params.id)

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

// ----------------------------import pdf--------------------------------

// router.post("/importPDF", async(req, res) => {
//   try{
//     const browser = await puppeteer.launch(
//       {
//         headless: 'new', 
//         args: [
//           '--disable-dev-shm-usage',
//           '--no-sandbox',
//           '--disable-setuid-sandbox'
//       ] 
//       }
//     )
//     const html = 
//     '<html lang="en">'+
//     '<head>'+
//     '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'+
//     '<link rel="stylesheet" href="./../../assets/main.css">'+  
//     '<title>Document</title>'+
//     '</head>'+
//     '<body style="font-family:Open Sans, sans-serif, normal; font-weight: 100 !important;">'+
//       '<div>'+
//         '<p>Kunden Nr.: 99998888</p>'+
//         '<p>Angebot Nr.: 11111111</p>'+
//         '<p>Leistungszeitraum: 18.11.2023 - 17.11.2026</p>'+
//         '<p>Kunden Nr.: 99998888</p>'+
//       '</div>'+
//     '</body>'+
//     '</html>';

//     const page  = await browser.newPage()
//     await page.setContent(html)
//     await page.emulateMediaFeatures('screen')
//     await page.pdf({
//         path: 'pdf/xyz.pdf',
//         displayHeaderFooter: true,
//         landscape: true,
//         printBackground: true,
//         headerTemplate: "<div/>",
//         footerTemplate: "<div style=\"text-align: right;width: 297mm;font-size: 8px;\"><span style=\"margin-right: 1cm\"><span class=\"pageNumber\"></span> of <span class=\"totalPages\"></span></span></div>"
//     })

//     return res.json({
//       status: true
//     })

//   }catch(err){  
//     return res.json({    
//       status: err
//     })
//   }
// })

module.exports = router