import React, { useState, useEffect } from "react";
import style from "./singleDeviceForm.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash
} from "@fortawesome/free-solid-svg-icons";

export default function SingleDeviceForm({
  index,
  deviceList,
  setDeviceList,
  priceTableArray,
  optionDisabled
}){

  useEffect(() => {
    
  },[deviceList])
  const handleDeviceNameInput = (e) => {
    deviceList[index]['deviceName'] = e.target.value
    setDeviceList([...deviceList])
  }

  const handleServiceGroupInput = (e) => {
    deviceList[index]['serviceGroup'] = e.target.value
    setDeviceList([...deviceList])
  }

  const handleDeviceSerialNumberInput = (e) => {
    deviceList[index]['serialNumber'] = e.target.value
    setDeviceList([...deviceList])
  }

  const handleDeviceEquipmentNumberInput = (e) => {
    deviceList[index]['equipmentNumber'] = e.target.value
    setDeviceList([...deviceList])
  }

  const handleDeviceLocationInput = (e) => {
    deviceList[index]['location'] = e.target.value
    setDeviceList([...deviceList])
  }

  const handleDeviceDateInput = (e) => {
    deviceList[index]['date'] = e.target.value
    setDeviceList([...deviceList])
  }

  const handleRemoveDevice = (e) => {
    deviceList.splice(index, 1)
    setDeviceList([...deviceList])
  }
  return (
    <div className={style.tabOuter}>
      <div className={style.formCol}>

        <input  className={style.formControl} type="text" value={deviceList[index]['deviceName'] ? deviceList[index]['deviceName'] : ""} onChange={handleDeviceNameInput} placeholder="Device Name" />
      </div>

      <div className={style.formCol}>
        <select
          className={style.formControl}
          name="serviceGroup" 
          placeholder="Service Group" 
          id=""
          value={deviceList[index]['serviceGroup']}
          disabled={priceTableArray.length > 0 ? false : true}
          onChange={handleServiceGroupInput}
          >
          <option disabled hidden value="">Service Group</option>
          {
            priceTableArray.length > 0 
            ?
              priceTableArray.map((pta) =>{
                return(
                  <option key = {pta['_id']}value={pta['serviceGroup']}>{pta['serviceGroup']}</option>
                )
              })
            :
            <></>
          }
        </select>
      </div>

      <div className={style.formCol}>

        <input
        placeholder="Serial Number" 
          className={style.formControl}
          type="text"
          value={deviceList[index]['serialNumber'] ? deviceList[index]['serialNumber'] : ""}
          onChange={handleDeviceSerialNumberInput}
          name=""
        />
      </div>

      <div className={style.formCol}>

        <input
          className={style.formControl}
          placeholder="Equipment number"
          type="text"
          value={deviceList[index]['equipmentNumber'] ? deviceList[index]['equipmentNumber'] : ""}
          onChange={handleDeviceEquipmentNumberInput}
          name=""
        />
      </div>

      <div className={style.formCol}>

        <input
          className={style.formControl}
          placeholder="Location"
          type="text"
          value={deviceList[index]['location'] ? deviceList[index]['location'] : ""}
          onChange={handleDeviceLocationInput}
          name=""
        />
      </div>

      <div className={style.formCol}>
        <input 
          placeholder="Date" 
           className={style.formControl} 
           type="date"
           value={deviceList[index]['date'] ? deviceList[index]['date'] : ""}
           onChange={handleDeviceDateInput}
        />
      </div>
      <span>
        <FontAwesomeIcon icon={faTrash} onClick={handleRemoveDevice}/>
      </span>

    </div>
  )
}