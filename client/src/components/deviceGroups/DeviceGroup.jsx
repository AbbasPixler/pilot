import React , {useState, useEffect, useContext} from 'react';
import style from "./deviceGroups.module.css";
import Device from "./../device/Device";
import { Context } from "../../context/Context";
import Optional from "./../optionals/Optional";
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

const deviceObject = {
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
}

const optionalObject = {
  optionalName: "",
  serviceGoup: "",  
  _id:"",
  itemNumber: "",
  quantity: 1,
  discountPercent: 0,
  price: 0,
  totalDiscountedPrice:0,
  hours: 0,
  totalHours: 0,
}


export default function DeviceGroup(
  {
    group,
    listingIndex,
    index,
    listings,
    setListings,
    deviceList,
    priceTableArray,
    calculateTotalPrice,
    optionalsArray,
    setOptionalsArray,
    offers
  }
){

  const { user } = useContext(Context);  
  const [translations, setTranslations] = useState(user.data.language.translations)


  const handleRemoveDeviceGroups = () => {
    if(listings[listingIndex]['deviceGroups'].length > 1){
      listings[listingIndex]['deviceGroups'].splice(index, 1)
      setListings([...listings])
      calculateTotalPrice()
    }
  }
  const handleAddDevice = () => {
    const newDeviceObject = JSON.stringify(deviceObject)
    const deviceObj = JSON.parse(newDeviceObject)
    listings[listingIndex]['deviceGroups'][index]['devices'].push(deviceObj)
    setListings([...listings])
  }
  const handleAddOption = () => {    
    const newOptionalObject = JSON.stringify(optionalObject)
    const optionalObj = JSON.parse(newOptionalObject)
    listings[listingIndex]['deviceGroups'][index]['optionals'].push(optionalObj)
    setListings([...listings])
  }
  const handleGroupNameChange = (e) => {
    listings[listingIndex]['deviceGroups'][index]['groupName'] = e.target.value
    setListings([...listings])
  }
  return(
    <div style={{marginBottom:"20px", borderBottom: "1px solid #C1C1C1"}}>
    <div className={style.tabletdname}>
      <label>
        <span
         onClick={handleRemoveDeviceGroups}
        >
          <FontAwesomeIcon icon={faTrash} style={{color:'#ff1111'}}  />
        </span>
        <FontAwesomeIcon icon={faBoxOpen} /> 
        {translations && translations['Geraetegruppe'] ? translations['Geraetegruppe'] : "{Geraetegruppe}"}
      </label>

      <input 
        type="text"
        name="gpOne"
        className={style.formControl + " " + style.fullField}
        value={listings[listingIndex]['deviceGroups'][index]['groupName'] ? listings[listingIndex]['deviceGroups'][index]['groupName'] : ""}
        onChange={(e)=> handleGroupNameChange(e)}
        placeholder="Gerätegruppe Freitext"
      />
    </div>

    {group['devices'].map((gerat, i)=>{
      return (
        <Device device={gerat} listingIndex={listingIndex} deviceGroupIndex={index} index={i} listings={listings} setListings={setListings} deviceList = {deviceList} priceTableArray={priceTableArray} calculateTotalPrice = {calculateTotalPrice} offers={offers} />
      )
    })} 

    {group['optionals'].map((option, j)=>{
      return (
        <Optional 
        option={option} 
        listingIndex={listingIndex} 
        deviceGroupIndex={index} 
        index={j} 
        listings={listings} 
        setListings={setListings} 
        calculateTotalPrice = {calculateTotalPrice} 
        optionalsArray ={optionalsArray}
        setOptionalsArray ={setOptionalsArray}
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
        onClick={handleAddDevice}
      >
        <FontAwesomeIcon icon={faPlus} />
        {translations && translations['Geraet'] ? translations['Geraet'] : "{Geraet}"}
      </Button>
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
        onClick={handleAddOption}
      >
        <FontAwesomeIcon icon={faPlus} />
        {translations && translations['Optional'] ? translations['Optional'] : "{Optional}"}
      </Button>
    
    </div>
    </div>
  )
}