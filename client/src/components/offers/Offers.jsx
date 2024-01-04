import React, { useState, useEffect,useContext } from "react";
import style from "./offers.module.css"
import { Context } from "../../context/Context";

export default function Offers({
  priceTableData,
  priceTableArray,
  setPriceTableArray,
  servicesArray,
  setServicesArray,
  priceVersionArray2,
  setPriceVersionArray,
  serviceGroup,
  setServiceGroup,
  companyID,
  setCompanyID,
  priceVersion,
  setPriceVersion,
  listings,
  quotePrice,
  setQuotePrice,
  offers,
  setOffers,
  companies,
  handleEmpytServiceGroupInDeviceList,
  optionDisabled,
  setOptionDisabled,
  customers,
  optionalsArray,
  setOptionalsArray,
  travelCostsArray,
  setTravelCostsArray,
  tPrice,
  setTPrice,
  setCustomer,
  setEndCustomer,
  handleReFillPrice
}){


  const [exchangeRate, setExchangeRate] = useState(0)
  const [priceString, setPriceString] = useState("")
  const { user } = useContext(Context);
  const [translations, setTranslations] = useState(user.data.language.translations)

  useEffect(() => { 
    if(tPrice > 0 && offers['currency'].length > 0){
      if(offers['currency'] == "euro"){
        setPriceString(tPrice.toLocaleString('de-DE', {currency: 'EUR', style: 'currency'}))
      }else if(offers['currency'] == "gbp"){
        setPriceString(tPrice.toLocaleString('en-EN', {currency: 'GBP', style: 'currency'}))
      }else if(offers['currency'] == "dkk"){
        setPriceString(tPrice.toLocaleString('dk-DK', {currency: 'DKK', style: 'currency'}))
      }else if(offers['currency'] == "usd"){
        setPriceString(tPrice.toLocaleString('en-EN', {currency: 'USD', style: 'currency'}))
      }else if(offers['currency'] == "chf"){
        setPriceString(tPrice.toLocaleString('ch-CH', {currency: 'CHF', style: 'currency'}))
      }else if(offers['currency'] == "nok"){
        setPriceString(tPrice.toLocaleString('no-NO', {currency: 'NOK', style: 'currency'}))
      }else if(offers['currency'] == "sek"){
        setPriceString(tPrice.toLocaleString('se-SE', {currency: 'SEK', style: 'currency'}))
      }
    }else{
      // setPriceString
    }
  }, [quotePrice, tPrice, offers['currency']])

  const handleChangeOfferLocationInput = (e) => {

    
    if(priceVersion.length > 0 && serviceGroup.length > 0){
      const filteredArray  = priceTableData.filter((inc) => inc['materialGroup'] && inc['materialGroup'].includes("Maintenance") && inc['company_id'] == e.target.value && inc['service'] == serviceGroup && inc['priceVersion'] == priceVersion )
      const filteredOptionalsArray = priceTableData.filter((inc) => inc['materialGroup'] && inc['materialGroup'].includes("Optional")&& inc['company_id'] == e.target.value && inc['service'] == serviceGroup && inc['priceVersion'] == priceVersion )
      const filteredTravelCostsArray = priceTableData.filter((inc) => inc['materialGroup'] && inc['materialGroup'].includes("Travelcosts")&& inc['company_id'] == e.target.value && inc['service'] == serviceGroup && inc['priceVersion'] == priceVersion )
      setOptionalsArray(filteredOptionalsArray)
      setTravelCostsArray(filteredTravelCostsArray)
      
      setPriceTableArray(filteredArray)
      setCompanyID(e.target.value)
      offers['location'] = e.target.value    
      setOffers({...offers})


      if(filteredArray.length > 0){
        const justAnArray = []
        for(let x of priceTableData){
          if(x['company_id'] == e.target.value && !justAnArray.includes(x['service'])){
            justAnArray.push(x['service'])
          }
        }    
        setServicesArray(justAnArray)
  
        const justAnArray2 = []
        for(let x of priceTableData){
          if(x['service'] == serviceGroup &&!justAnArray2.includes(x['priceVersion'])){
            justAnArray2.push(x['priceVersion'])
          }
        }
        setPriceVersionArray(justAnArray2)
        
      handleReFillPrice(filteredArray)

      }else{
        const filteredArray  = priceTableData.filter((inc) => inc['materialGroup'] && inc['materialGroup'].includes("Maintenance") && inc['company_id'] == e.target.value)
        const filteredOptionalsArray = filteredArray.filter((inc) => inc['materialGroup'] && inc['materialGroup'].includes("Optional"))
        const filteredTravelCostsArray = filteredArray.filter((inc) => inc['materialGroup'] && inc['materialGroup'].includes("Travelcosts"))
    
        // 
    
        setOptionalsArray(filteredOptionalsArray)
        setTravelCostsArray(filteredTravelCostsArray)
    
        const justAnArray = []
        for(let x of filteredArray){
          if(!justAnArray.includes(x['service'])){
            justAnArray.push(x['service'])
          }
        }    
        setServicesArray(justAnArray)
        setPriceVersionArray([]) 
        setServiceGroup("")
        setPriceVersion("")
        setPriceTableArray(filteredArray)
        setCompanyID(e.target.value)
        offers['location'] = e.target.value    
        setOffers({...offers})
      }
      
    }else{
      const filteredArray  = priceTableData.filter((inc) => inc['materialGroup'] && inc['materialGroup'].includes("Maintenance") && inc['company_id'] == e.target.value)
      const filteredOptionalsArray = priceTableData.filter((inc) => inc['materialGroup'] && inc['materialGroup'].includes("Optional") && inc['company_id'] == e.target.value)
      const filteredTravelCostsArray = priceTableData.filter((inc) => inc['materialGroup'] && inc['materialGroup'].includes("Travelcosts") && inc['company_id'] == e.target.value)
  
      setOptionalsArray(filteredOptionalsArray)
      setTravelCostsArray(filteredTravelCostsArray)
  
      const justAnArray = []
      for(let x of filteredArray){
        if(!justAnArray.includes(x['service'])){
          justAnArray.push(x['service'])
        }
      }    
      setServicesArray(justAnArray)
      setPriceVersionArray([]) 
      setServiceGroup("")
      setPriceVersion("")
      setPriceTableArray(filteredArray)
      setCompanyID(e.target.value)
      offers['location'] = e.target.value    
      setOffers({...offers})
      // handleEmpytServiceGroupInDeviceList()
    }
   
  }

  const handleMaintenanceChange = (e) => {
    if(companyID.length > 0 && serviceGroup.length > 0){
      const filteredArray  = priceTableData.filter((inc) => inc['service'] == e.target.value && inc['company_id'] == companyID && inc['priceVersion'] == priceVersion && inc['materialGroup'] && inc['materialGroup'].includes("Maintenance"))      
      // const filteredOptionalsArray = priceTableData.filter((inc) => inc['materialGroup'] && inc['materialGroup'].includes("Optional")&& inc['service'] == e.target.value && inc['company_id'] == companyID && inc['priceVersion'] == priceVersion)
      // const filteredTravelCostsArray = priceTableData.filter((inc) => inc['materialGroup'] && inc['materialGroup'].includes("Travelcosts")&& inc['service'] == e.target.value && inc['company_id'] == companyID && inc['priceVersion'] == priceVersion)
  
  
      // setOptionalsArray(filteredOptionalsArray)
      // setTravelCostsArray(filteredTravelCostsArray)
      
      setPriceTableArray(filteredArray)
      setServiceGroup(e.target.value) 
      offers['maintenance'] = e.target.value
      
    
      setOffers({...offers})
  
      if(filteredArray.length > 0){
        const justAnArray = []
        for(let x of priceTableData){
          if(x['company_id'] == companyID && !justAnArray.includes(x['priceVersion'])){
            justAnArray.push(x['priceVersion'])
          }
        }
        setPriceVersionArray(justAnArray)

        // const justAnArray2 = []
        // for(let x of filteredArray){
        //   if(!justAnArray2.includes(x['service'])){
        //     justAnArray2.push(x['service'])
        //   }
        // }    
        // setServicesArray(justAnArray2)
        
      handleReFillPrice(filteredArray)
      }else{
        setPriceVersion("")
        const filteredArray  = priceTableData.filter((inc) => inc['service'] == e.target.value && inc['company_id'] == companyID )
        setPriceTableArray(filteredArray)
        setServiceGroup(e.target.value) 
        offers['maintenance'] = e.target.value
    
        const justAnArray = []
        for(let x of filteredArray){
          if(!justAnArray.includes(x['priceVersion'])){
            justAnArray.push(x['priceVersion'])
          }
        }
        setPriceVersionArray(justAnArray)
      }
  
      setOffers({...offers})
    }else{
      setPriceVersion("")
      const filteredArray  = priceTableData.filter((inc) => inc['service'] == e.target.value && inc['company_id'] == companyID )
      setPriceTableArray(filteredArray)
      setServiceGroup(e.target.value) 
      offers['maintenance'] = e.target.value
  
      const justAnArray = []
      for(let x of filteredArray){
        if(!justAnArray.includes(x['priceVersion'])){
          justAnArray.push(x['priceVersion'])
        }
      }
      setPriceVersionArray(justAnArray)
  
      setOffers({...offers})
      // handleEmpytServiceGroupInDeviceList()
      // setOptionDiabled(true)
    }


  }

  const handlePriceVersionChange = (e) => {
    if(serviceGroup.length > 0 && companyID.length > 0){
  
      setPriceVersion(e.target.value)
      offers['priceVersion'] = e.target.value
      setOffers({...offers})
      const filteredArray  = priceTableData.filter((inc) => inc['priceVersion'] == e.target.value && inc['company_id'] == companyID && inc['service'] == serviceGroup && inc['materialGroup'] && inc['materialGroup'].includes("Maintenance"))
      const filteredOptionalsArray = priceTableData.filter((inc) => inc['priceVersion'] == e.target.value && inc['company_id'] == companyID && inc['materialGroup']  && inc['materialGroup'].includes("Optional"))
      const filteredTravelCostsArray = priceTableData.filter((inc) => inc['priceVersion'] == e.target.value && inc['company_id'] == companyID && inc['materialGroup']  && inc['materialGroup'].includes("Travelcosts"))
  
      setOptionalsArray(filteredOptionalsArray)
      setTravelCostsArray(filteredTravelCostsArray)
      setPriceTableArray(filteredArray)
      handleReFillPrice(filteredArray)
      // setOptionDisabled(false)
    }else{
      setPriceVersion(e.target.value)
      offers['priceVersion'] = e.target.value
      setOffers({...offers})
      const filteredArray  = priceTableData.filter((inc) => inc['priceVersion'] == e.target.value && inc['company_id'] == companyID && inc['service'] == serviceGroup && inc['materialGroup'] && inc['materialGroup'].includes("Maintenance"))
      const filteredOptionalsArray = priceTableData.filter((inc) => inc['priceVersion'] == e.target.value && inc['company_id'] == companyID && inc['materialGroup']  && inc['materialGroup'].includes("Optional"))
      const filteredTravelCostsArray = priceTableData.filter((inc) => inc['priceVersion'] == e.target.value && inc['company_id'] == companyID && inc['materialGroup']  && inc['materialGroup'].includes("Travelcosts"))
  
      setOptionalsArray(filteredOptionalsArray)
      setTravelCostsArray(filteredTravelCostsArray)
      setPriceTableArray(filteredArray)
    }
  }

  const handleChangeOfferNumberInput = (e) => {
    offers['offerNumber'] = e.target.value
    setOffers({...offers})
  }

  const handleChangeRevisionInput = (e) => {
    offers['revision'] = e.target.value
    setOffers({...offers})
  }
  
  const handleChangeCouldInput = (e) => {
    const thisCustomer = customers.filter((cust) => cust['_id'] == e.target.value)
    setCustomer(thisCustomer[0])
    offers['could'] = e.target.value
    setOffers({...offers})
  }

  const handleChangeEndCustomerInput = (e) => {
    const thisCustomer = customers.filter((cust) => cust['_id'] == e.target.value)
    setEndCustomer(thisCustomer[0])
    offers['endCustomer'] = e.target.value
    setOffers({...offers})
  }

  const handleChangeCurrencyInput = (e) => {
    offers['currency'] = e.target.value
    setOffers({...offers})
  }

  const handleExchangeRateInput = (e) => {
    const cal = quotePrice * e.target.value
    setTPrice(cal)
    setExchangeRate(e.target.value)
    offers['exchangeRate'] = e.target.value
    setOffers({...offers})
  }

  return(
    <div className={style.tabOuter}>

      <div className={style.formCol}>
        <label>{translations && translations['Angebotsnummer'] ? translations['Angebotsnummer'] : "{Angebotsnummer}"}</label>

        <input
          className={style.formControl}
          type="text"
          // placeholder={translations && translations['Angebotsnummer'] ? translations['Angebotsnummer'] : "{Angebotsnummer}"}
          placeholder="Angebotsnummer"
          name=""
          value={offers['offerNumber'] ? offers['offerNumber'] : ""}
          onChange={handleChangeOfferNumberInput}
        />
      </div>

      <div className={style.formCol}>
        <label>{translations && translations['Revision'] ? translations['Revision'] : "{Revision}"}</label>

        <input
          className={style.formControl}
          type="number"
          name=""
          value={offers['revision']}
          onChange={handleChangeRevisionInput}
        />
      </div>

      <div className={style.formCol}>
        <label>{translations && translations['Standort'] ? translations['Standort'] : "{Standort}"}</label>
        <select value={offers['location'] ? offers['location'] : ""} onChange={handleChangeOfferLocationInput} className={style.formControl}>
          <option disbled selected hidden >Systems GmbH</option>
          {companies.length > 0 ?
          companies.map((comp) => {
            return(
              <option key={comp['_id']} value={comp['ident']}> { comp['name'] + " - " + comp['ident']} </option>
            )
          })
        :
        <></>}
        </select>
      </div>

      <div className={style.formCol}>
        <label>{translations && translations['Maintenance'] ? translations['Maintenance'] : "{Maintenance}"}</label>

        <select className={style.formControl} disabled = {companyID.length > 0 ? false : true} placeholder="Auswählen" onChange={handleMaintenanceChange}>

          <option value="" disabled hidden selected={serviceGroup.length > 0 ? false : true} >Auswählen</option>

          {servicesArray.length > 0
          ?
          servicesArray.map((main) => {
            if(main.includes("maintenance") || main.includes("Maintenance")){
              return (
                <option selected = {serviceGroup == main ? true : false} value={main} > {main} </option>
              )
            }
            
          })
          :
          <></>
          }
        </select>
      </div>

      <div className={style.formCol}>
        <label>{translations && translations['Price Version'] ? translations['Price Version'] : "{Price Version}"}</label>

        <select className={style.formControl} disabled = {serviceGroup.length > 0 && companyID.length > 0 ? false : true} placeholder="Auswählen" onChange={handlePriceVersionChange}>
          <option value="" disabled hidden selected = {priceVersion.length > 0 ? false : true}>Auswählen</option>

          {
          priceVersionArray2.length > 0

          ?

          priceVersionArray2.map((main) => {
            return (
              <option selected = {priceVersion == main ? true : false} value={main} >{main} </option>
            )
          })
          :
          <></>
          }
        </select>
      </div>

      <div className={style.formCol}>
        <label>{translations && translations['Kunde'] ? translations['Kunde'] : "{Kunde}"}</label>
        <select onChange={handleChangeCouldInput} className={style.formControl} placeholder="Auswählen">
          <option disbled selected hidden >Auswählen</option>
          {customers.length > 0 ?
          customers.map((comp) => {
            return(
              <option value={comp['_id']} selected={offers['could'] == comp['_id'] ? true : false}> { comp['name'] }</option>
            )
          })
        :
        <></>}
        </select>
        {/* <input
          className={style.formControl}
          type="text"
          name=""
          value={offers['could'] ? offers['could'] : ""}
          onChange={handleChangeCouldInput}
        /> */}
      </div>

      <div className={style.formCol}>
        <label>{translations && translations['Endkunde'] ? translations['Endkunde'] : "{Endkunde}"}</label>
        <select onChange={handleChangeEndCustomerInput} className={style.formControl} placeholder="Auswählen">
          <option disbled selected hidden >Auswählen</option>
          {customers.length > 0 ?
          customers.map((comp) => {
            return(
              <option value={comp['_id']} selected={offers['endCustomer'] == comp['_id'] ? true : false}> { comp['name'] }</option>
            )
          })
        :
        <></>}
        </select>
        {/* <input
          className={style.formControl}
          type="text"
          name=""
          value={offers['endCustomer'] ? offers['endCustomer'] : ""}
          onChange={handleChangeEndCustomerInput}
        /> */}
      </div>

      <div className={style.formCol}>
        <label>{translations && translations['Waehrung'] ? translations['Waehrung'] : "{Waehrung}"}</label>

        <select 
        className={style.formControl}
        onChange={handleChangeCurrencyInput}
        >
          <option value="" disabled hidden selected>Currency</option>
          <option selected ={offers['currency'] && offers['currency'] == "euro" ? true : false} value="euro">EUR</option>
          <option selected ={offers['currency'] && offers['currency'] == "gbp" ? true : false} value="gbp">GBP</option>
          <option selected ={offers['currency'] && offers['currency'] == "dkk" ? true : false} value="dkk">DKK</option>
          <option selected ={offers['currency'] && offers['currency'] == "use" ? true : false} value="usd">USD</option>
          <option selected ={offers['currency'] && offers['currency'] == "chf" ? true : false} value="chf">CHF</option>
          <option selected ={offers['currency'] && offers['currency'] == "nok" ? true : false} value="nok">NOK</option>
          <option selected ={offers['currency'] && offers['currency'] == "sek" ? true : false} value="sek">SEK</option>
        </select>
      </div>

      <div className={style.formCol}>
        <label>{translations && translations['Umrechnungskurs'] ? translations['Umrechnungskurs'] : "{Umrechnungskurs}"}</label>

        <input
          className={style.formControl}
          type="Number"
          name=""
          value={offers['exchangeRate']}
          onChange={handleExchangeRateInput}
          min="0"
          // readOnly=""

        />
      </div>

      {
        listings.length > 0
        ?
        listings.map((list, index) => {

          let pString = ""

          if(list['totalPrice'] && offers['currency'].length > 0){
            if(offers['currency'] == "euro"){
              pString = list['totalPrice'].toLocaleString('de-DE', {currency: 'EUR', style: 'currency'})
            }else if(offers['currency'] == "gbp"){
              pString = list['totalPrice'].toLocaleString('en-EN', {currency: 'GBP', style: 'currency'})
            }else if(offers['currency'] == "dkk"){
              pString = list['totalPrice'].toLocaleString('dk-DK', {currency: 'DKK', style: 'currency'})
            }else if(offers['currency'] == "usd"){
              pString = list['totalPrice'].toLocaleString('en-EN', {currency: 'USD', style: 'currency'})
            }else if(offers['currency'] == "chf"){
              pString = list['totalPrice'].toLocaleString('ch-CH', {currency: 'CHF', style: 'currency'})
            }else if(offers['currency'] == "nok"){
              pString = list['totalPrice'].toLocaleString('no-NO', {currency: 'NOK', style: 'currency'})
            }else if(offers['currency'] == "sek"){
              pString = list['totalPrice'].toLocaleString('se-SE', {currency: 'SEK', style: 'currency'})
            }
          }

          return(
            <div className={style.formCol + " " + style.disableInput}>
              <label>{`# ${index + 1}`}</label>

              <input
                className={style.formControl}
                type="text"
                name=""
                value={pString}
                pattern="^\d*(\.\d{0,2})?$"
                readOnly=""
              />
            </div>
          )
        })
        :
        <></>
      }
{/* 
      <div className={style.formCol + " " + style.disableInput}>
        <label>#1</label>

        <input
          className={style.formControl}
          type="number"
          name=""
          value="50.000"
          pattern="^\d*(\.\d{0,2})?$"
          readOnly=""
        />
      </div>

      <div className={style.formCol + " " + style.disableInput}>
        <label>#2</label>

        <input
          className={style.formControl}
          type="number"
          name=""
          value="10.000"
          pattern="^\d*(\.\d{0,2})?$"
          readOnly=""
        />
      </div> */}

      <div className={style.formCol + " " + style.disableInput}>
        <label>{translations && translations['Gesamtsumme'] ? translations['Gesamtsumme'] : "{Gesamtsumme}"}</label>

        <input
          className={style.formControl}
          type="text"
          name=""
          value={priceString}
          pattern="^\d*(\.\d{0,2})?$"
          readOnly=""
        />
      </div>
    </div>
  )
}


