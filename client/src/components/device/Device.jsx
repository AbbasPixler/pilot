import React, {useState, useEffect, useContext} from 'react';
import style from "./device.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Context } from "../../context/Context";
import {
  faPen,
  faSave,
  faFileContract,
  faClose,
  faTrash,
  faPlus,
  faBox,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";



export default function Device({
  device,
  listingIndex,
  deviceGroupIndex,
  index,
  listings,
  setListings,
  deviceList,
  priceTableArray,
  calculateTotalPrice,
  offers
}){
  
  const { user } = useContext(Context);  
  const [translations, setTranslations] = useState(user.data.language.translations)


  const handleRemoveDevice = () => {
    if(listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'].length > 1){
      listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'].splice(index, 1)
      setListings([...listings])
      calculateTotalPrice()
    }
  }
  const checkingFunction = (PriceAsAnInteger) =>{
    let countryAbbreviation = ""
    let currencyCode = ""
    if(offers['currency'].length > 0){
      if(offers['currency'] == "euro"){
        countryAbbreviation = 'de-DE'
        currencyCode = 'EUR'
      }else if(offers['currency'] == "gbp"){
        countryAbbreviation = 'en-EN'
        currencyCode = 'GBP'
      }else if(offers['currency'] == "dkk"){
        countryAbbreviation = 'dk-DK'
        currencyCode = 'DKK'
      }else if(offers['currency'] == "usd"){
        countryAbbreviation = 'en-EN'
        currencyCode = 'USD'
      }else if(offers['currency'] == "chf"){
        countryAbbreviation = 'ch-CH'
        currencyCode = 'CHF'
      }else if(offers['currency'] == "nok"){
        countryAbbreviation = 'no-NO'
        currencyCode = 'NOK'
      }else if(offers['currency'] == "sek"){
        countryAbbreviation = 'se-SE'
        currencyCode = 'SEK'
      }
    } 
    let pString = PriceAsAnInteger.toLocaleString(countryAbbreviation, {currency: currencyCode, style: 'currency'})
    return pString
  }

  const handleGeratInputChange = (e) => {
    const thisSG = e.target.selectedOptions[0].getAttribute('data-service')
    const thisPricing = priceTableArray.filter((pta) => thisSG == pta['serviceGroup'])

    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['deviceName'] = e.target.value
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['itemNumber'] = thisPricing[0]['material']
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['serviceGroup'] = thisSG
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['price'] = thisPricing[0]['price']
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['hours'] = thisPricing[0]['workingTime']

    // calculation=========================================================

    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['totalDiscountedPrice'] = Math.round(listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['quantity'] * (thisPricing[0]['price'] / 100) * (100 - listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['discountPercent']))
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['totalHours'] = listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['quantity'] * thisPricing[0]['workingTime']
    setListings([...listings])

    calculateTotalPrice()

  }

  const handleDisountPercentChangeInput = (e) => {
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['discountPercent'] = e.target.value
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['totalDiscountedPrice'] = listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['quantity'] * (listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['price'] / 100) * (100 - Number(e.target.value))
    setListings([...listings])
    calculateTotalPrice()
  }

  const handleQuantityInputChange = (e) => {
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['quantity'] = e.target.value
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['totalDiscountedPrice'] = Number(e.target.value) * (listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['price'] / 100) * (100 - Number(listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['discountPercent']))
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['totalHours'] = Number(e.target.value) * listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['hours']
    setListings([...listings])
    calculateTotalPrice()
  }
  const handlePriceChange = (e) => {
    if(e.target.value == Number(e.target.value)){
      listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['price'] = e.target.value    
      listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['totalDiscountedPrice'] = Math.round(listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['quantity'] * (Number(e.target.value) / 100) * (100 - listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['discountPercent']))
      setListings([...listings])
      calculateTotalPrice()
    }
  }
  return (
    <div className={style.tabletdname}>
          <label>
            <span 
            onClick={handleRemoveDevice}
            >
              <FontAwesomeIcon icon={faTrash} style={{color:'#ff1111'}}  />
            </span>
            <FontAwesomeIcon icon={faBox} />
           {translations && translations['Geraet'] ? translations['Geraet'] : "{Geraet}"}
          </label>

          <div className={style.multistepinput}>
            <select 
              className={style.formControl}
              name="glOne"
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['deviceName']}
              onChange={handleGeratInputChange}
            >
              <option disabled hidden value= "" >Gerat</option>
              {deviceList.length > 0
              ?
              deviceList.map((dl) => {
                return (
                  <option value={dl['deviceName']} data-service={dl['serviceGroup']}>{dl['deviceName']}</option>
                )
              })
              :
              <></>}
            </select>

            <input
              type="text"
              name="glTwo"
              className={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['found'] == true ? style.formControl : style.formControlNew}
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['itemNumber'] ? listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['itemNumber'] : ""}
              //onChange={(e)=> handleGeratInputChange(e, i)}
              placeholder="S872ELAE"
              readOnly=""
            />
            

            <input
              type="number"
              name="quantity"
              className={style.formControl + " " + style.smallControl}
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['quantity'] ? listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['quantity'] : 0}
              onChange={handleQuantityInputChange}
              min="1"
              placeholder="2"
            />
            <div style={{display:'flex', flexDirection:"row", alignItems:"center", boxShadow: "2px 3px 4px #b5b5b5"}} >
            {/* <span style={{display:'flex', flexDirection:"row",marginLeft:"10px",alignItems:"center"}}> */}
            <input
              type="text"
              name="discountPercentage"
              className={style.formControl2 + " " + style.midumControl}
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['discountPercent'] ? listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['discountPercent'] : 0}
              onChange={handleDisountPercentChangeInput}
              placeholder="0.00 %"
            />
              <span style={{marginLeft:"0px", marginRight:"5px"}}> %</span>
             </div>


            <input
              type="text"
              name="price"
              className={style.formControl + " " + style.midumControl + " " + style.disable}
              pattern="^\d*(\.\d{0,2})?$"
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['price'] ? checkingFunction(listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['price']) : 0}
              //onChange={(e)=> handleGeratInputChange(e, i)}
              onChange={handlePriceChange}
              placeholder="10.000"
              readOnly={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['found'] == true ? true : false}
            />

            <input
              type="text"
              name="totalDiscountedPrice"
              className={style.formControl + " " + style.midumControl + " " + style.disable}
              pattern="^\d*(\.\d{0,2})?$"
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['totalDiscountedPrice'] ? checkingFunction(listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['totalDiscountedPrice']) : 0}
              //onChange={(e)=> handleGeratInputChange(e, i)}
              placeholder="20.000"
              readOnly=""
            />

            <input
              type="number"
              name="hours"
              className={style.formControl + " " + style.smallControl + " " + style.disableNumber}
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['hours'] ? listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['hours'] : 0}
              //onChange={(e)=> handleGeratInputChange(e, i)}
              placeholder="2"
              readOnly=""
            />

            <input
              type="number"
              name="totalHours"
              className={style.formControl + " " + style.smallControl + " " + style.disableNumber}
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['totalHours'] ? listings[listingIndex]['deviceGroups'][deviceGroupIndex]['devices'][index]['totalHours'] : 0}
              //onChange={(e)=> handleGeratInputChange(e, i)}
              placeholder="4"
              readOnly=""
            />
          </div>
        </div>
  )
}


