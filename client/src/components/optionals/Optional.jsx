import React, {useState, useEffect, useContext} from 'react';
import style from "./optional.module.css";
import { Context } from "../../context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

export default function Optional({ 
  option,
  listingIndex,
  deviceGroupIndex,
  index,
  listings,
  calculateTotalPrice,
  setListings,
  optionalsArray,
  setOptionalsArray,
  offers
}){

  const { user } = useContext(Context);  
  const [translations, setTranslations] = useState(user.data.language.translations)

  const handleOptionalsInputChange = (e)=>{
    const thisOption = optionalsArray.filter((op) => op['_id'] == e.target.value)
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['_id'] = e.target.value
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['optionalName'] = thisOption[0]['service']
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['serviceGroup'] = thisOption[0]['serviceGroup']
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['itemNumber'] = thisOption[0]['material']
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['price'] = thisOption[0]['price']
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['hours'] = thisOption[0]['workingTime']
       
    // calculation=========================================================

    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['totalDiscountedPrice'] = listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['quantity'] * (thisOption[0]['price'] / 100) * (100 - listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['discountPercent'])
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['totalHours'] = listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['quantity'] * thisOption[0]['workingTime']
    setListings([...listings])
   
    calculateTotalPrice()
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

  
  const handleDisountPercentChangeInput = (e) => {
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['discountPercent'] = e.target.value
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['totalDiscountedPrice'] = listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['quantity'] * (listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['price'] / 100) * (100 - Number(e.target.value))
    setListings([...listings])
    calculateTotalPrice()
  }

  const handleQuantityInputChange = (e) => {
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['quantity'] = e.target.value
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['totalDiscountedPrice'] = Number(e.target.value) * (listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['price'] / 100) * (100 - Number(listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['discountPercent']))
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['totalHours'] = Number(e.target.value) * listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['hours']
    setListings([...listings])
    calculateTotalPrice()
  }

  const handleRemoveOption = () => {
    listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'].splice(index, 1)
    setListings([...listings])
    calculateTotalPrice()
  }
  return (
    <div className={style.tabletdname}>
          <label>
            <span 
            onClick={handleRemoveOption}
            >
              <FontAwesomeIcon icon={faTrash} style={{color:'#ff1111'}} />
            </span>
            <FontAwesomeIcon icon={faBox} />
            {translations && translations['Optional'] ? translations['Optional'] : "{Optional}"}
          </label>

          <div className={style.multistepinput}>
          <select 
              className={style.formControl}
              name="glOne"
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['_id']}
              onChange={handleOptionalsInputChange}
            >
              <option disabled hidden value="">Optionals</option>
              {
                optionalsArray.length > 0
                  ?
                optionalsArray.map((dl) => {
                  return (
                    <option
                    value={dl['_id']}
                    data-service={dl['serviceGroup']}
                    >
                      {dl['service']}
                    </option>
                  )
                })
                  :
                <></>
              }
            </select>

            <input
              type="text"
              name="optTwo"
              className={style.formControl}
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['itemNumber'] ? listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['itemNumber'] : ""}
              //onChange={(e)=> handleGeratInputChange(e, i)}
              placeholder="S872ELAE"
              readOnly=""
            />

            <input
              type="number"
              name="quantity"
              className={style.formControl + " " + style.smallControl}
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['quantity'] ? listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['quantity'] : 0}
              onChange={handleQuantityInputChange}
              min="1"
              placeholder="2"
            />
<div style={{display:'flex', flexDirection:"row", alignItems:"center", boxShadow: "2px 3px 4px #b5b5b5"}} >
          
            <input
              type="text"
              name="discountPercentage"
              className={style.formControl2 + " " + style.midumControl}
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['discountPercent'] ? listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['discountPercent'] : 0}
              onChange={handleDisountPercentChangeInput}
              placeholder="0.00 %"
            />
            <span style={{marginLeft:"0px", marginRight:"5px"}}> %</span>
           </div>

            <input
              type="text"
              name="price"
              className={style.formControl + " " + style.midumControl}
              pattern="^\d*(\.\d{0,2})?$"
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['price'] ? checkingFunction(listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['price']) : 0}
              //onChange={(e)=> handleGeratInputChange(e, i)}
              placeholder="10.000"
              readOnly=""
            />

            <input
              type="text"
              name="totalDiscountedPrice"
              className={style.formControl + " " + style.midumControl + " " + style.disable}
              pattern="^\d*(\.\d{0,2})?$"
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['totalDiscountedPrice'] ? checkingFunction(listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['totalDiscountedPrice']) : 0}
              //onChange={(e)=> handleGeratInputChange(e, i)}
              placeholder="20.000"
              readOnly=""
            />

            <input
              type="number"
              name="hours"
              className={style.formControl + " " + style.smallControl + " " + style.disableNumber}
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['hours'] ? listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['hours'] : 0}
              //onChange={(e)=> handleGeratInputChange(e, i)}
              placeholder="2"
              readOnly=""
            />

            <input
              type="number"
              name="totalHours"
              className={style.formControl + " " + style.smallControl + " " + style.disableNumber}
              value={listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['totalHours'] ? listings[listingIndex]['deviceGroups'][deviceGroupIndex]['optionals'][index]['totalHours'] : 0}
              //onChange={(e)=> handleGeratInputChange(e, i)}
              placeholder="4"
              readOnly=""
            />
          </div>
        </div>
  )
}