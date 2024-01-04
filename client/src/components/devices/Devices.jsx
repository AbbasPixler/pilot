import React, { useState, useEffect } from "react";
import style from "./devices.module.css"
import SingleDeviceForm from "../singleDeviceForm/SingleDeviceForm"

export default function Devices({
  deviceList,
  setDeviceList,
  priceTableArray,
  optionDisabled
}){

  useEffect(() => {
  }, [deviceList])
  return(
    <div>
      {
      deviceList.map((device, index) => {
          return (           
            <SingleDeviceForm key={index} index={index} deviceList={deviceList} setDeviceList={setDeviceList} priceTableArray = {priceTableArray} optionDisabled={optionDisabled} />
          )
       })
       }
    </div>
  )

}