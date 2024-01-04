const express = require("express")
const Languages = require("./../model/model.languages")
const auth = require("../../middleware/auth")
const router = express.Router()

router.post("/create", auth, async(req, res) => {

  try{
    if(req.body.language.language.length < 1 || req.body.language.initials.length < 1){
      return res.send({
        status: false,
        message: "Please provide all neccessary information!",
        data: null
      })
    }
    const alreadyName = await Languages.find({language: req.body.language.language})
    const alreadyInitials = await Languages.find({initials: req.body.language.initials})
  
    if(alreadyName.length > 0 || alreadyInitials.length > 0){
      return res.send({
        status: false,
        message: "Language oe Initials already exist!",
        data: null
      })
    }
    const language = new Languages(req.body.language)
    await language.save()
  
    return res.json({
      status: true,
      message: "Language created successfully !",
      data: language
    })  
  }catch(err){
    return res.send({
      status: false,
      message: err.message,
      data: null
    })
  }

  
})

router.post("/fetchAll", auth, async(req, res) => {
  try{
    const languages = await Languages.find()
    if(languages.length < 1){
      return res.json({
        status: false,
        message: "No Languages found!",
        data: null
      })
    }
    return res.json({
      status: true,
      message: "Languages fetched successfully!",
      data: languages
    })
  }catch(err){
    return res.json({
      status: false,
      message: err.message,
      data: null
    })
  }
})

router.post("/createTranslations", auth, async(req, res) => {
  try{

    const rawArray = req.body.translation
    const newObj = {}
    for(let x of rawArray){
      if(x !== null){
        const object1 = {}
            const object2 = {}
        for(let y of Object.keys(x)){
            const object4 = {}
            if(y !== "words"){
                if(newObj[y]){
                    newObj[y][x['words']] = x[y]
                }else{
                object4[x['words']] = x[y]
                newObj[y] = object4
                }
                object2[y] = x[y]
            }
            object1[x['words']] = object2
        }
      } 
    }
    console.log(newObj)
    for(let x of Object.keys(newObj)){
      await Languages.findOneAndUpdate({initials: x}, {translations: newObj[x]})
    }

    return res.send({
      status: true,
      message: "Translations have been updated successfully",
      data: newObj
    })
  }catch(err){
    return res.send({   
      status: true,
      data: newObj,
      message: err.message
    })
  }
})

module.exports = router
