import React, { useState, useEffect, useContext } from 'react';
import style from "./listing.module.css";
import { Context } from "../../context/Context";
import DeviceGroup from '../deviceGroups/DeviceGroup';
import TravelCost from "../travelCost/TravelCost";
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


const deviceGroupObject = {
  groupName: "",
  devices: [{
    deviceName: "",
    serviceGoup: "",
    itemNumber: "",
    quantity: 1,
    discountPercent: 0,
    price: 0,
    totalDiscountedPrice:0,
    hours: 0,
    totalHours: 0,
    found: true
  }],
  optionals: [{
    _id: "",
    optionalName: "",
    serviceGoup: "",
    itemNumber: "",
    quantity: 1,
    discountPercent: 0,
    price: 0,
    totalDiscountedPrice:0,
    hours: 0,
    totalHours: 0,
  }]
}

const travelCostObject = {
  _id:"",
  travelCostName: "",
  serviceGoup: "",
  itemNumber: "",
  quantity: 1,
  discountPercent: 0,
  price: 0,
  totalDiscountedPrice:0,
  hours: 0,
  totalHours: 0,
}

export default function Listing(
  {
    listing,
    index,
    listings,
    setListings,
    deviceList,
    priceTableArray,
    calculateTotalPrice,
    optionalsArray,
    setOptionalsArray,
    travelCostsArray,
    setTravelCostsArray,
    setValueTwo,
    offers
  }
){

  const { user } = useContext(Context);  
  const [translations, setTranslations] = useState(user.data.language.translations)

  const handleAddGroup = () => {
    const newDeviceGroupObject = JSON.stringify(deviceGroupObject)
    const deviceGroupObj = JSON.parse(newDeviceGroupObject)
    listings[index]['deviceGroups'].push(deviceGroupObj)
    setListings([...listings])
  }
  const handleAddTravelCosts = () => {
    const newTravelCostObject = JSON.stringify(travelCostObject)
    const travelCostObj = JSON.parse(newTravelCostObject)
    listings[index]['travelCosts'].push(travelCostObj)
    setListings([...listings])
  }
  const handleChangeListingNameInput = (e) => {
    listings[index]['name'] = e.target.value
    setListings([...listings])
  }
  const handleChangeListingStartDateInput = (e) => {  
    // -------------------------------------
    console.log(e.target.value)
    const date_1 = new Date(e.target.value)
    const diff = 365 * 1000 * 3600 * 24
    const timeStamp_1 = date_1.getTime()

    const timeStamp_2 = timeStamp_1 + diff
    const date_2 = new Date(timeStamp_2)

    console.log("bdsab: ",date_2.toLocaleDateString('fr-CA'))
    // -------------------------------------
    listings[index]['startDate'] = e.target.value
    listings[index]['endDate'] = date_2.toLocaleDateString('fr-CA')
    setListings([...listings])
  }
  const handleChangeListingEndDateInput = (e) => {
    listings[index]['endDate'] = e.target.value
    setListings([...listings])
  }

  const handleRemoveListing = (e, listindex) => {
    if(listings.length > 1){
      listings.splice(listindex, 1)
      setValueTwo(listindex)
      setListings([...listings])
      calculateTotalPrice()
    }
  };

  

  return (
    <div className={style.tabOuter}>
      {/* <div>
        <button onClick={(e) => handleRemoveListing(e, index)} style={{backgroundColor: "red", padding: "5px 10px", color: "white", outline: "0", border: "0"}}>Delete</button>
      </div> */}
                <div className={style.user_dataname}>
                  <span
                  onClick={(e) => handleRemoveListing(e, index)}
                  >
                    <FontAwesomeIcon icon={faTrash} style={{color:'#ff1111'}}  />
                  </span>
                  <input
                    type="text"
                    name=""
                    value={listings[index]['name'] ? listings[index]['name'] : ""}
                    className={style.formControl}
                    onChange = {handleChangeListingNameInput}
                  />

                    <input
                      id="startDate"
                      type="date"
                      name=""
                      // value="2023-08-31"
                      value={listings[index]['startDate'] ? listings[index]['startDate'] : ""}
                      className={style.formControl}
                      onChange = {handleChangeListingStartDateInput}
                    />

                    <input
                      id="endDate"
                      type="date"
                      name=""
                      value={listings[index]['endDate'] ? listings[index]['endDate'] : ""}
                      className={style.formControl}
                      onChange = {handleChangeListingEndDateInput}
                    />
                </div>

                <div className={style.tableOuter}>
                  <div className={style.tablerow}>
                    {listing['deviceGroups'].map((group, l)=>{
                      return (
                        <DeviceGroup 
                        group={group} 
                        listingIndex={index} 
                        index={l} 
                        listings={listings} 
                        setListings={setListings} 
                        deviceList = {deviceList}  
                        priceTableArray={priceTableArray} 
                        calculateTotalPrice = {calculateTotalPrice} 
                        optionalsArray ={optionalsArray}
                        setOptionalsArray ={setOptionalsArray}
                        offers={offers}
                        />                      
                      )
                    })}

                    {listing['travelCosts'].map((reisekosten, k)=> {
                      return (
                        <TravelCost 
                        travelCost={reisekosten} 
                        index={k} 
                        listingIndex={index} 
                        listings={listings} 
                        setListings={setListings}
                        calculateTotalPrice = {calculateTotalPrice} 
                        travelCostsArray ={travelCostsArray} 
                        setTravelCostsArray={setTravelCostsArray}
                        offers={offers}
                        />
                      )
                    })}

                    <div
                      className={style.tabletdname + " " + style.buttongroup}
                    >
                      <Button
                        sx={{
                          backgroundColor: "#000",
                          fontSize: "14px",
                          color: "#fff",
                          textTransform: "capitalize",
                          fontWeight: "600",
                          gap: "5px",
                          padding: "5px 20px",
                          borderRadius: "10px",
                          marginLeft: "5px",
                          "&:hover": { backgroundColor: "#292929" },
                        }}
                        onClick={handleAddTravelCosts}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        {translations && translations['Reisekosten'] ? translations['Reisekosten'] : "{Reisekosten}"}
                      </Button>
                    </div>
                  </div>
                </div>
                <div 
                 className={style.tabletdname + " " + style.buttongroup}
                 >
                <Button
                  sx={{
                    backgroundColor: "#000",
                    fontSize: "14px",
                    color: "#fff",
                    textTransform: "capitalize",
                    fontWeight: "600",
                    gap: "5px",
                    padding: "5px 20px",
                    borderRadius: "10px",
                    marginLeft: "5px",
                    "&:hover": { backgroundColor: "#292929" },
                  }}
                  onClick={handleAddGroup}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  {translations && translations['Gruppe'] ? translations['Gruppe'] : "{Gruppe}"}
                </Button>
                </div>
              </div>
  )
}