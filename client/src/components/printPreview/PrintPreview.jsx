import {React, useState, useEffect, useRef} from "react";
import Logo from "./../../assets/img/pilotLogo.png";
import style from "./printPreview.module.css";
import parse from 'html-react-parser';
import Optional from "../optionals/Optional";
import jsPDF from "jspdf";
import font from "./TT_Norms_Pro_ExtraLight-normal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileContract,
  } from "@fortawesome/free-solid-svg-icons";
  
import Button from "@mui/material/Button";

const rowStyling={
    // border: "none",
    boxShadow: "none"
}
const rowStyling2={
    // border: "none",
    boxShadow: "none",
    marginBottom: "20px"
}
export default function PrintPreview (
    {
        template, 
        offers, 
        customer, 
        endCustomer,
        deviceList,
        listings,
        contact,
        companies,
        owner
    }
    ){
    // const string = `${template.templateString}`


        const [totalServicesPrice, setTotalServicesPrice] = useState({})
        const [totalOptionalPrice, setTotalOptionalPrice] = useState({})
        const [totalTravelCostPrice, setTotalTravelCostPrice] = useState({})
        const [totalDisountPercentage, setTotalDiscountPercentage] = useState(0)
        const [totalDiscount, setTotalDiscount] = useState(0)
        const [company, setCompany] = useState({})
        let htmlElement = useRef(null);

        useEffect(() => {
            let tservices = 0
            let toptionals = 0
            let ttravelCosts = 0
            let tdservices = 0
            let tdoptionals = 0
            let tdtravelCosts = 0
            for(let listing of listings){
                for(let devGroups of listing['deviceGroups']){
                    for(let dev of devGroups['devices']){
                        tservices = Number(tservices) + Number(dev['price'])
                        tdservices = Number(tdservices) + Number(dev['totalDiscountedPrice'])
                    }

                    for(let dev of devGroups['optionals']){
                        toptionals = Number(toptionals) + Number(dev['price'])
                        tdoptionals = Number(tdoptionals) + Number(dev['totalDiscountedPrice'])
                    }
                }

                for(let dev of listing['travelCosts']){
                    ttravelCosts = Number(ttravelCosts) + Number(dev['price'])
                    tdtravelCosts = Number(tdtravelCosts) + Number(dev['totalDiscountedPrice'])
                }
            }

            // const
            totalServicesPrice['totalPrice'] = tservices
            totalServicesPrice['totalDiscountedPrice'] = tdservices
            totalOptionalPrice['totalPrice'] = toptionals
            totalOptionalPrice['totalDiscountedPrice'] = tdoptionals
            totalTravelCostPrice['totalPrice'] = ttravelCosts
            totalTravelCostPrice['totalDiscountedPrice'] = tdtravelCosts

            const discountP = (((tservices + toptionals + ttravelCosts) - (tdservices + tdoptionals + tdtravelCosts)) * 100)/ (tservices + toptionals + ttravelCosts)
            const discount = ((tservices + toptionals + ttravelCosts) - (tdservices + tdoptionals + tdtravelCosts))
            setTotalDiscountPercentage(discountP)
            setTotalDiscount(discount)
  
            
            setTotalServicesPrice({...totalServicesPrice})
            setTotalOptionalPrice({...totalOptionalPrice})
            setTotalTravelCostPrice({...totalTravelCostPrice})

            const comp = companies.filter((com) => com['ident'] == offers['location'])
            setCompany(comp[0])

        },[listings])

        const dateFormat = (data) =>{
            const date = new Date(data);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${day}.${month}.${year}`;
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
    if(PriceAsAnInteger){
        let pString = PriceAsAnInteger.toLocaleString(countryAbbreviation, {currency: currencyCode, style: 'currency'})
        return pString
    }else{
        let m = 0
        let pString = m.toLocaleString(countryAbbreviation, {currency: currencyCode, style: 'currency'})
        return pString
    }
  }


        const handlePrintPDF = () => {
            let doc = new jsPDF("potrait", "px", [842, 595]);
            const htmlString = "<h1>Hello</h1>"

            // doc.addFileToVFS("TT_Norms_Pro_ExtraLight-normal.ttf", font);
            // doc.addFont("MyFont.ttf", "MyFont", "normal");
            // doc.setFont("MyFont");
            doc.html(htmlElement.current, {
              async callback(doc) {
                window.open(doc.output("bloburl"), "_blank");
              },
            });
        }
        console.log(owner)
  return (
    <div>
        
   <div style={{display: "flex", width: "100%", flexDirection: "row"}}>
        <Button
              sx={{
                backgroundColor: "#000",
                fontSize: "16px",
                color: "#fff",
                textTransform: "capitalize",
                fontWeight: "600",
                gap: "5px",
                padding: "8px 20px",
                borderRadius: "10px",
                marginLeft: "auto",
                "&:hover": { backgroundColor: "#292929" },
              }}
              // onClick={handleClose}
              onClick={handlePrintPDF}
              >
              <FontAwesomeIcon icon={faFileContract} />
              Drucken
            </Button>
   </div>

    <div className={style.printbody} >


    <div className={style.template + " " + style.ssA4Container}  ref={htmlElement}>
            <div className={style.a4container } style={minHeightPage}>
                <div className={style.printHeader}>
                    <div className={style.sitelogo}>
                        <div className={style.logo}> <img src={Logo} alt="logo"/> </div>
                    </div>
                    <div className={style.siteheader} style={siteheader}>
                        <p style={{fontSize: "12px"}} contentEditable={true}>Service-Vertrag: Advanced</p>
                        <p style={{fontSize: "12px"}}>Angebot Nr.: {offers['offerNumber'] ? offers['offerNumber'] :"N/A"}<br/>Kunde: {customer['name']}</p>
                    </div>
                </div>
                <div className={style.content}>
                        
                    <div className={style.conntentheader} style={siteheaderTitle}>Dienstleistungsvereinbarung Advanced</div>

                    <div className={style.no_p_margin} style={{marginTop: "50px"}}>
                        <p  style={{fontSize: "12px"}}>Angebot Nr.: {offers['offerNumber'] ? offers['offerNumber'] :"N/A"}</p>
                        <p  style={{fontSize: "12px"}}>Leistungszeitraum: {listings[0]['startDate'].split("-")[2] + "." +listings[0]['startDate'].split("-")[1] + "." +listings[0]['startDate'].split("-")[0]} - {listings[listings.length - 1]['endDate'].split("-")[2] + "." + listings[listings.length - 1]['endDate'].split("-")[1] + "." + listings[listings.length - 1]['endDate'].split("-")[0]}</p>
                        <p  style={{fontSize: "12px"}}>Kunden Nr.: {customer['customerNumber']}</p>
                        <p  style={{fontSize: "6px"}}><span style={{fontSize:"8pt"}}>(Angebotsnummer bitte bei jeder Korrespondenz mit angeben)</span></p>
                    </div>

                    <div className={style.no_p_margin + " " + style.flex} style={{marginTop: "40px"}}>
                        <div className={style.flex1} style={{fontSize: "12px"}}>An:</div>
                        <div className={style.flex5}>
                            <p  style={{fontSize: "12px"}}>{customer['name']}</p>
                            <p  style={{fontSize: "12px"}}>{customer['streetnumber']}</p>
                            <p  style={{fontSize: "12px"}}>{customer['zipcode']}</p>
                            <p  style={{fontSize: "12px"}}>{customer['country']}</p>                    
                        </div>                
                    </div>

                    <div className={style.no_p_margin + " " + style.flex} style={{marginTop: "25px"}}>
                        <div className={style.flex1} style={{fontSize: "12px"}}>Von:</div>
                        <div className={style.flex5}>
                            <p style={{fontSize: "12px"}}>{company['name']}</p>
                            <p style={{fontSize: "12px"}}>{company['streetNumber']}</p>
                            <p style={{fontSize: "12px"}}>{company['zipcode']}</p>
                            <p style={{fontSize: "12px"}}>{company['country']}</p>                     
                        </div>                
                    </div>
                    <div className={style.no_p_margin + " " + style.fontsizeA4} style={{marginTop: "30px"}}>
                        <p style={{fontSize: "9px"}}>Erstellt am: {dateFormat(offers['createdDate'])}</p>  
                    </div>
                    <div className={style.no_p_margin + " " + style.fontsizeA4} style={{marginTop: "30px"}}>
                        <p style={{fontSize: "12px"}}><b>Ihr Kontakt für die Bestellung:</b></p>
                        <p style={{fontSize: "12px"}}>Technical Service BPS Central Europe</p>
                        <p style={{fontSize: "12px"}}>Fax: +49 551 308 2539</p>
                        <p style={{fontSize: "12px"}}>E-Mail: Technical-Service-Bioprocess@sartorius.com</p>     
                    </div>

                    <div className={style.dicription} style={{marginTop: "25px"}}>
                        <p style={{fontSize: "12px"}}><b>Hinweis:</b> Bitte geben Sie bei der Bestellung Ihre Bestell- sowie Auftragsnummer mit an und richten  Sie die Bestellung per E-Mail an uns. </p>
                    </div>
                </div>
                <div className={style.printFooter}  style={steptwo}>
                    <p style={{ fontSize: "12px"}}>Seite 1</p>
                </div>
            </div>
            <div className={style.a4container} style={minHeightPage}>
                <div className={style.printHeader}>
                    <div className={style.sitelogo}>
                    <div className={style.logo}> <img src={Logo} alt="logo"/> </div>
                    </div>
                    <div className={style.siteheader} style={siteheader}>
                        <p style={{fontSize: "12px"}}>Service-Vertrag: Advanced</p>
                        <p style={{fontSize: "12px"}}>Angebot Nr.: {offers['offerNumber'] ? offers['offerNumber'] :"N/A"}<br/>Kunde: {customer['name']}</p>
                    </div>
                </div>
                <div className={style.content}>
                    
               <div className={style.conntentheader} style={siteheaderTitle}>Inhaltsverzeichnis</div>

                    <div className={style.no_p_margin} style={{marginTop: "50px", paddingBottom:"80px", fontSize: "12px"}} id="IndexRows">
                            <div className={style.flex + " " + style.space}>
                                <p>Ansprechpartner und Geräteliste</p>
                                <p className={style.flex1}><line></line></p>
                                <p>3</p>
                            </div>
                            <div className={style.flex + " " + style.space}>
                                <p>Preisübersicht</p>
                                <p className={style.flex1}><line></line></p><p>4</p>
                            </div>
                            {/* <div className={style.flex + " " + style.space}>
                                <p>Datenblatt #123</p>
                                <p className={style.flex1}><line></line></p>
                                <p>7</p>
                            </div> */}
                            <div className={style.flex + " " + style.space}>
                                <p>Wir sind für Sie da - Ihr Ansprechpartner</p>
                                <p className={style.flex1}><line></line></p><p>6</p>
                            </div>
                    </div>
                </div>
                <div className={style.printFooter} style={steptwo}>
                   <p style={{ fontSize: "12px"}}>Seite 2</p>
                </div>
            </div>
            <div className={style.a4container} style={minHeightPage}>
                <div className={style.printHeader}>
                    <div className={style.sitelogo}>
                    <div className={style.logo}> <img src={Logo} alt="logo"/> </div>
                    </div>
                    <div className={style.siteheader} style={siteheader}>
                        <p style={{fontSize: "12px"}}>Service-Vertrag: Advanced</p>
                        <p style={{fontSize: "12px"}}>Angebot Nr.: {offers['offerNumber'] ? offers['offerNumber'] :"N/A"}<br/>Kunde: {customer['name']}</p>
                    </div>
                </div>
                <div className={style.content}>
                    
        <div className={style.conntentheader} style={siteheaderTitle} >Ansprechpartner und Geräteliste</div>

        <table style={{paddingTop: "10mm"}} className={style.tables + " " + style.no_p_margin + " " + style.no_p_padding + " " +  style.Tablepdleft}>
            <thead>
                <tr style={rowStyling}>
                    <th className={style.left} colspan="2" style={tableHead}>Geräteverantwortlicher</th>
                </tr>
            </thead>
            <tbody style={{fontSize: "12px"}}>
                <tr style={rowStyling}>
                    <td>Firmenname</td>
                    <td>{endCustomer['name'] ? endCustomer['name'] : "" }</td>
                </tr>
                <tr style={rowStyling}>
                    <td>Kundennummer</td>
                    <td>{endCustomer['customerNumber'] ? endCustomer['customerNumber'] : "" }</td>
                </tr>
                <tr style={{boxShadow: "none", minHeight: "20px !important", marginTop:"100px"}}>
                    <td style={{minHeight: "20px !important"}}></td>
                    <td></td>
                </tr>
                <tr style={{boxShadow: "none", minHeight: "20px !important", marginTop:"100px"}}>
                    <td style={{minHeight: "20px !important"}}></td>
                    <td></td>
                </tr>
                <tr style={{boxShadow: "none", minHeight: "20px !important", marginTop:"100px"}}>
                    <td style={{minHeight: "20px !important"}}></td>
                    <td></td>
                </tr>
                <tr style={rowStyling}>
                    <td>Kontaktperson</td>
                    <td>{contact['contactPerson'] ? contact['contactPerson'] : "" }</td>
                </tr>
                <tr style={rowStyling}>
                    <td>Adresse</td>
                    <td>{contact['contactAddress'] ? contact['contactAddress'] : "" }</td>
                </tr>
                <tr style={rowStyling}>
                    <td>PLZ | Ort</td>
                    <td>{contact['contactZipcode'] ? contact['contactZipcode'] : "" }</td>
                </tr>
                <tr style={rowStyling}>
                    <td>Telefon</td>
                    <td>{contact['telephone'] ? contact['telephone'] : "" }</td>
                </tr>
                <tr style={rowStyling}>
                    <td>E-Mail</td>
                    <td>{contact['email'] ? contact['email'] : "" }</td>
                </tr>

{/* 
                <tr style={rowStyling}>
                    <td>Firmenname</td>
                    <td>device_company_name</td>
                </tr>
                <tr style={rowStyling}>
                    <td>Kundennummer</td>
                    <td>device_company_name</td>
                </tr>
                <tr style={rowStyling}>
                    <td>Kontaktperson</td>
                    <td>device_company_name</td>
                </tr>
                <tr style={rowStyling}>
                    <td>Adresse</td>
                    <td>device_company_name</td>
                </tr>
                <tr style={rowStyling}>
                    <td>PLZ | Ort</td>
                    <td>device_company_name</td>
                </tr>
                <tr style={rowStyling}>
                    <td>Telefon</td>
                    <td>device_company_name</td>
                </tr>
                <tr style={rowStyling}>
                    <td>E-Mail</td>
                    <td>device_company_name</td>
                </tr> */}
            </tbody>
        </table>    

        <table style={{marginTop: "10mm"}} className={style.tables + " " + style.no_p_margin + " " + style.no_p_padding}>
            <thead>
                <tr style={rowStyling}>
                    <th className={style.left}>Pos.</th>
                    <th className={style.left}>Gerätename</th>
                    <th className={style.left}>Serien Nr.</th>
                    <th className={style.left}>Inventar Nr.</th>
                    <th className={style.left}>Standort</th>
                </tr>
            </thead>
            <tbody id="DeviceRows">
                {
                    deviceList.map((dev, index) => {
                        return(
                            <tr key={index} style={rowStyling}>
                                <td>{index + 1}</td>
                                <td>{dev['deviceName']}</td>
                                <td>{dev['serialNumber']}</td>
                                <td>{dev['equipmentNumber']}</td>
                                <td>{dev['location']}</td>
                            </tr>
                        )
                    })
                }
            
                        
        
                        </tbody>
        </table>                

                </div>
                <div className={style.printFooter}  style={steptwo}>
                    <p style={{fontSize: "12px"}}>Seite 3</p>
                </div>
            </div>
            {/* <div className={style.a4container} style={minHeightPage}>
                <div className={style.printHeader}>
                    <div className={style.sitelogo}>
                    <div className={style.logo}> <img src={Logo} alt="logo"/> </div>
                    </div>
                    <div className={style.siteheader} style={siteheader}>
                        <p style={{fontSize: "12px"}}>Service-Vertrag: Advanced</p>
                        <p style={{fontSize: "12px"}}>Angebot Nr.: {offers['offerNumber'] ? offers['offerNumber'] :"N/A"}<br/>Kunde: {customer['name']}</p>
                    </div>
                </div>
                <div className={style.content}>
                
                </div>
                <div className={style.printFooter}  style={steptwo}>
                    <p style={{fontSize: "12px"}}> Seite 4</p>
                </div>
            </div> */}
            <div className={style.a4container} style={minHeightPage}>
                <div className={style.printHeader}>
                    <div className={style.sitelogo}>
                    <div className={style.logo}> <img src={Logo} alt="logo"/> </div>
                    </div>
                    <div className={style.siteheader} style={siteheader}>
                        <p style={{fontSize: "12px"}}>Service-Vertrag: Advanced</p>
                        <p style={{fontSize: "12px"}}>Angebot Nr.: {offers['offerNumber'] ? offers['offerNumber'] :"N/A"}<br/>Kunde: {customer['name']}</p>
                    </div>
                </div>
                <div className={style.content}>
                    
        <div className={style.conntentheader} style={siteheaderTitle}>Preisübersicht</div>

        <tfooter>
                </tfooter><tfooter>
                </tfooter><tfooter>
                </tfooter>
                
       <table style={{marginTop: "10mm"}} className={style.tables + " " + style.no_p_margin + " " + style.no_p_padding + " " + style.tableTopAling } id="priceTables">

            {
                listings.map((listing) => {
                    let travelIndex = listing['deviceGroups'].length + 1
                    let travelTotalCost = 0;
                    let travelTotalDiscountedCost = 0;
                    for(let travel of listing['travelCosts']){
                        travelTotalCost = travelTotalCost + Number(travel['price'])
                        travelTotalDiscountedCost = travelTotalDiscountedCost = Number(travel['totalDiscountedPrice'])
                    }
                    return(
                        <>
                        <thead style={{marginTop: "5mm"}}>
                            <tr style={rowStyling}>
                                <th colspan="2" className={style.left}>{listing['name']} {listing['startDate'].split("-")[2] + "." +listing['startDate'].split("-")[1] + "." +listing['startDate'].split("-")[0] + " - " + listing['endDate'].split("-")[2] + "." +listing['endDate'].split("-")[1] + "." +listing['endDate'].split("-")[0]}</th>
                                <th className={style.right}>Gerätezahl</th>
                                <th className={style.right} style={{textTransform: "capitalize"}}>Preis
                                 {/* in {offers['currency']} */}
                                 </th>
                            </tr>
                        </thead>

                        {
                            listing['deviceGroups'].map((deviceGroups, deviceGroupsIndex) => { 
                                let totalDeviceCost = 0
                                for(let x of deviceGroups['devices']){
                                    totalDeviceCost = totalDeviceCost + Number(x['totalDiscountedPrice'])
                                }
                                let totalQuantity = 0
                                for(let x of deviceGroups['devices']){
                                    totalQuantity = totalQuantity + Number(x['quantity'])
                                }
                                return(
                                    <>
                                    <tbody id="priceTable">
                                    <tr style={rowStyling}>
                                                    <td>Pos. {deviceGroupsIndex + 1}</td>
                                                    <td>{deviceGroups['groupName']}</td>
                                                    <td className={style.right}>{totalQuantity}</td>
                                                    <td className={style.right}>{checkingFunction(totalDeviceCost)}</td> 
                                    </tr>
                                      
                                      {
                                          deviceGroups['optionals'] && deviceGroups['optionals'][0] && deviceGroups['optionals'][0]['_id'].length > 0 
                                          ?  
                                        deviceGroups['optionals'].map((option) =>{
                                            return(
                                                <tr style={rowStyling}>
                                                    <td>&nbsp;</td>
                                                    <td>

                                                        <ul style={{listTypeStyle: "disc"}}>
                                                            <li>{option['optionalName'] + " " + option['serviceGroup']} (1x {checkingFunction(Number(option['price']) / Number(option['quantity']))})</li>
                                                        </ul>
                                                    </td>
                                                    <td className={style.right}>&nbsp;</td>
                                                    <td className={style.right}>{checkingFunction(option['totalDiscountedPrice'])}</td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <></>
                                      }
                                      
                                      
                                        
                                    </tbody>
                                   
                                    </>
                                )
                            })
                        }
                        {/* {
                            listing['travelCosts'].map((travel) => {
                                return(
                                    <>
                                <tr style={rowStyling}>
                                    <td>Pos. {travelIndex}</td>
                                    <td>
                                        <ul>
                                            <li>{travel['travelCostName'] + " " + travel['serviceGroup']} (1x {Number(travel['price']) / Number(travel['quantity'])})</li>
                                        </ul>
                                    </td>
                                    <td className={style.right}>&nbsp;</td>
                                    <td className={style.right}>{checkingFunction(travel['totalDiscountedPrice'])}</td>
                                </tr>
                                </>
                                )
                            })
                        } */}
                        {
                            listing['travelCosts'].length > 0
                                ?

                                <tr style={rowStyling}>
                                    <td>Pos. {listing['deviceGroups'].length + 1}</td>
                                    <td>Voraussichtliche Reisekosten</td>
                                    <td className={style.right}>&nbsp;</td>
                                    <td className={style.right}>{checkingFunction(travelTotalDiscountedCost)}</td>
                                </tr>
                                :
                                <></>
                        }
                         <tbody style={{marginBottom: "100px !important"}}>
                                <tr style={rowStyling}>
                                    <td colspan="3" style={{borderTop: "1px solid #000", backgroundColor: "#f2f2f2"}}>&nbsp;</td>
                                    <td className={style.right} style={{borderTop: "1px solid #000", backgroundColor: "#f2f2f2"}}>{checkingFunction(listing['totalPrice'])}</td>
                                </tr>
                                
                        </tbody>
                        <br/>
                        
                       
                        </>
                    )
                })
            }

                        </table>
                </div>
                <div className={style.printFooter}  style={steptwo}>
                    <p style={{fontSize: "12px"}}>Seite 4</p>
                </div>
            </div>
            <div className={style.a4container} style={minHeightPage}>
                <div className={style.printHeader}>
                    <div className={style.sitelogo}>
                    <div className={style.logo}> <img src={Logo} alt="logo"/> </div>
                    </div>
                    <div className={style.siteheader} style={siteheader}>
                        <p style={{fontSize: "12px"}}>Service-Vertrag: Advanced</p>
                        <p style={{fontSize: "12px"}}>Angebot Nr.: {offers['offerNumber'] ? offers['offerNumber'] :"N/A"}<br/>Kunde: {customer['name']}</p>
                    </div>
                </div>
                <div className={style.content}>
                    
        <div className={style.conntentheader} style={siteheaderTitle}>Preisübersicht</div>

        <table style={{paddingTop: "5mm"}} className={style.tables + " " + style.tableTopAling}>
            <thead>
                <tr style={rowStyling}>
                    <th colspan="2" className={style.left}>Leistungszeitraum gesamt: {listings[0]['startDate'].split("-")[2] + "." +listings[0]['startDate'].split("-")[1] + "." +listings[0]['startDate'].split("-")[0]} - {listings[listings.length - 1]['endDate'].split("-")[2] + "." +listings[listings.length - 1]['endDate'].split("-")[1] + "." +listings[listings.length - 1]['endDate'].split("-")[0]}</th>
                    <th className={style.right} style={{textTransform: "capitalize"}}>Preis
                     {/* in {offers['currency']} */}
                     </th>
                </tr>
            </thead>
            <tbody>
                <tr style={rowStyling}>
                    <td colspan="2" className={style.bold}>Preis netto Service Leistungen</td>
                    {
                        
                    }
                    <td className={style.right}>{checkingFunction(totalServicesPrice['totalPrice'])} </td>
                </tr>
                <tr style={rowStyling}>
                    <td colspan="2" className={style.bold}>Preis netto Optionale Leistungen</td>
                    <td className={style.right}>{checkingFunction(totalOptionalPrice['totalPrice'])} </td>
                </tr>
                <tr style={rowStyling}>
                    <td colspan="2" className={style.bold}>Preis netto voraussichtliche Reisekosten</td>
                    <td className={style.right}>{checkingFunction(totalTravelCostPrice['totalPrice'])} </td>
                </tr>
                <tr style={rowStyling}>
                    <td >Rabatt</td>
                    <td className={style.right}>{totalDisountPercentage + " %"}</td>
                    <td className={style.right}>{checkingFunction(totalDiscount) + ""}</td>
                </tr>

                <tr style={rowStyling}>
                    <td colspan="2" style={{borderTop: "1px solid #000", backgroundColor: "#f2f2f2", fontWeight: "bold"}}>Gesamtpreis netto</td>
                    <td className={style.right} style={{borderTop: "1px solid #000", backgroundColor: "#f2f2f2", fontWeight: "bold"}}>{checkingFunction(totalOptionalPrice['totalDiscountedPrice'] + totalServicesPrice['totalDiscountedPrice'] + totalTravelCostPrice['totalDiscountedPrice'])} </td>
                </tr>

            </tbody>
        </table>      
        <div style={{paddingTop: "5mm" , fontSize: "13px"}}><b>Gültigkeit des Angebotes:</b> Bis {offers['validDate'] ? offers['validDate'].split("-")[2] + "." + offers['validDate'].split("-")[1] + "." + offers['validDate'].split("-")[0]: "N/A"} Preise verstehen sich zzgl. MwSt.</div>

        <div style={{paddingTop: "2mm" , fontSize: "13px"}}><b>Zahlungsbedingungen und Leistungen:</b> Preis pro Jahr / {offers['paymentDays'] ? offers['paymentDays'] + " days": "N/A"} Tage netto zu Beginn jedes Leistungsjahres.</div>

        <div style={{paddingTop: "5mm", fontSize: "13px"}}>Mit Annahme dieses Angebots erklären Sie sich mit unseren Allgemeinen Geschäftsbedingungen sowie mit unseren besonderen Geschäftsbedingungen einverstanden. Diese Transaktion unterliegt ausdrücklich den Sartorius Verkaufsbedingungen (Deutschland), die sich auf den Verkauf von Waren und Services beziehen und unter <a href="https://www.sartorius.com/download/618168/5/terms-and-conditions-of-sales-sartorius-germany-pdf-data.pdf">https://www.sartorius.com/download/618168/5/terms-and-conditions-of-sales-sartorius-germany-pdf-data.pdf</a> zu finden sind.</div>


        <div style={{paddingTop: "15mm", flexWrap: "wrap"}} className={style.flex}>
            <div style={{borderTop: "1px solid #000", marginRight:"10mm" , fontSize: "9px", width: "calc(50% - 10mm)", marginBottom: "50px"}}>i.V. Danny Gebauer, Manager of BPS Service CE</div>
            <div style={{borderTop: "1px solid #000", marginRight:"10mm", fontSize: "9px", width: "calc(50% - 10mm)", marginBottom: "50px"}}>i.V. Richard van Roosmalen, Service Sales BPS CE</div>
            <div style={{borderTop: "1px solid #000", marginRight:"10mm", fontSize: "9px", width: "calc(50% - 10mm)", marginBottom: "50px"}}>Kunde</div>
        </div>
                    
                </div>
                <div className={style.printFooter}  style={steptwo}>
                    <p style={{fontSize: "12px"}}>Seite 5</p>
                </div>
            </div>
            {/* <div className={style.a4container} style={minHeightPage}>
                <div className={style.printHeader}>
                    <div className={style.sitelogo}>
                    <div className={style.logo}> <img src={Logo} alt="logo"/> </div>
                    </div>
                    <div className={style.siteheader} style={siteheader}>
                        <p style={{fontSize: "12px"}}>Service-Vertrag: Advanced</p>
                        <p style={{fontSize: "12px"}}>Angebot Nr.: {offers['offerNumber'] ? offers['offerNumber'] :"N/A"}<br/>Kunde: {customer['name']}</p>
                    </div>
                </div>
                <div className={style.content}>
                    
                    <div className={style.conntentheader} style={siteheaderTitle}>Datenblatt #123</div>
                    <div style={{paddingTop: "10mm"}}>Datenblatt</div>
                    <div >Inhalt</div>

                </div>
                <div className={style.printFooter}  style={steptwo}>
                    <p style={{fontSize: "12px"}}> Seite 7 </p>
                </div>
            </div> */}
            <div className={style.a4container} style={minHeightPage}>
                <div className={style.printHeader}>
                    <div className={style.sitelogo}>
                    <div className={style.logo}> <img src={Logo} alt="logo"/> </div>
                    </div>
                    <div className={style.siteheader} style={siteheader}>
                        <p style={{fontSize: "12px"}}>Service-Vertrag: Advanced</p>
                        <p style={{fontSize: "12px"}}>Angebot Nr.: {offers['offerNumber'] ? offers['offerNumber'] :"N/A"}<br/>Kunde: {customer['name']}</p>
                    </div>
                </div>
                <div className={style.content}>
                    <div className={style.conntentheader} style={siteheaderTitle}> Wir sind für Sie da - Ihr Ansprechpartner</div>
 
                    <table style={{paddingTop: "6mm", fontSize:"10px"}} className={style.tables + " " + style.no_p_margin + " " + style.no_p_padding}>
                        <thead>
                            <tr style={rowStyling}>
                                <th className={style.left} colspan="2">Ihr persönlicher Ansprechpartner</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={rowStyling}>
                                <td style={{textTransform: "capitalize"}}>Name: {owner && ['firstname'] && owner['lastname'] ?owner['firstname'] + " " + owner['lastname'] : "N/A" }</td>
                                <td>Telephone: {owner && owner['phone'] ? owner['phone'] : "N/A"}</td>
                            </tr>
                            <tr style={rowStyling}>
                                <td>Service Sales BPS Central-Europe</td>
                                <td>E-Mail: {owner && owner['email'] ? owner['email'] : "N/A"}</td>
                            </tr>
                        </tbody>
                    </table>    

                    <table style={{paddingTop: "8mm", fontSize:"10px"}} className={style.tables + " " + style.no_p_margin + " " + style.no_p_padding}>
                        <thead>
                            <tr style={rowStyling}>
                                <th className={style.left} colspan="2">Anschrift: Technical Service Bioprocess Solutions Central Europe</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={rowStyling}>
                                <td><b>Geschäftsadresse:</b></td>
                                <td><b>Standort Service Center:</b></td>
                            </tr>
                            <tr style={rowStyling}>
                                <td>Sartorius Stedim Systems GmbH</td>
                                <td>Sartorius Stedim Systems GmbH</td>
                            </tr>
                            <tr style={rowStyling}>
                                <td>Robert-Bosch-Straße 5-7</td>
                                <td>Sartorius Servicecenter</td>
                            </tr>
                            <tr style={rowStyling}>
                                <td>34302 Guxhagen</td>
                                <td>Groner Siekanger 1</td>
                            </tr>
                            <tr style={rowStyling}>
                                <td></td>
                                <td>37081 Göttingen</td>
                            </tr>
                        </tbody>
                    </table>  

                    <table style={{paddingTop: "8mm", fontSize:"10px"}} className={style.tables + " " + style.no_p_margin + " " + style.no_p_padding}>
                        <thead>
                            <tr style={rowStyling}>
                                <th className={style.left} colspan="2">Telefonischer Kontakt | E-Mail</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={rowStyling}>
                                <td>Serviceline</td>
                                <td>00800 40 774 000</td>
                            </tr>
                            <tr style={rowStyling}>
                                <td>E-Mail</td>
                                <td>Technical-Service-Bioprocess@sartorius.com</td>
                            </tr>
                        </tbody>
                    </table>  
                
                    <div style={stepthree} className={style.flex}>
                        <div className={style.flex1} style={{paddingRight:"2mm"}}>Sitz der Gesellschaft<br/>Guxhagen, Germany<br/>Registergericht:<br/>Amtsgericht Fritzlar HRB Nr. 11105 </div>
                        <div className={style.flex1} style={{paddingRight:"2mm"}}>Geschäftsführer<br/>Luc Burgard<br/>Dr. Thorsten Peuker</div>
                        <div className={style.flex2} style={{paddingRight:"2mm"}}>Commerzbank AG, Göttingen<br/>Konto: 615 119 500 | BLZ 260 400 30<br/>SWIFT: COBA260</div>
                        <div className={style.flex2}>IBAN: DE57 2604 0030 0615 1195 00<br/>Steuer-Nr. 20 / 200 / 11101<br/>Steuer-Nr. CH: CHE-113.467.967 MWST<br/>Ust-IdNr. DE811152918</div>
                    </div>
                </div>
               <div className={style.printFooter}  style={steptwo}>
                <p style={{fontSize: "12px"}}>Seite 6</p>
               </div>
            </div>
    </div>


        </div>
        </div>
  )}

                  
        {/* <tr style={rowStyling}>
            <td>2</td>
            <td>D#2</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>3</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>4</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>5</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>6</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>7</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>8</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>9</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>10</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>11</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>12</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>13</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>14</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>15</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>16</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>17</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>18</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>19</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>20</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>21</td>
            <td>D#32</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                 */}


        {/* <table style={{paddingTop: "5mm"}} className={style.tables + " " + style.no_p_margin + " " + style.no_p_padding}>
            <thead>
                <tr style={rowStyling}>
                    <th className={style.left}>Pos.</th>
                    <th className={style.left}>Gerätename</th>
                    <th className={style.left}>Serien Nr.</th>
                    <th className={style.left}>Inventar Nr.</th>
                    <th className={style.left}>Standort</th>
                </tr>
            </thead>
            <tbody id="DeviceRows1">
            
        <tr style={rowStyling}>
            <td>22</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>23</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        
        <tr style={rowStyling}>
            <td>24</td>
            <td>D#3</td>
            <td></td>
            <td></td>
            <td>Loaction ABC</td>
        </tr>                
                        </tbody>
        </table>        */}


        {/* <thead style={{marginTop: "5mm"}}>
                <tr style={rowStyling}>
                    <th colspan="2" className={style.left}>ServicePeriodDescription</th>
                    <th className={style.right}>Gerätezahl</th>
                    <th className={style.right}>Preis in Currency</th>
                </tr>
            </thead>
            <tbody id="priceTable">
                <tr style={rowStyling}>
                    <td>1</td>
                    <td>Preis per Gerätegruppe ambr(R) 15 cc/24C</td>
                    <td className={style.right}>1</td>
                    <td className={style.right}>29.625,00</td>
                </tr>
                <tr style={rowStyling}>
                    <td>&nbsp;</td>
                    <td>
                        <ul>
                            <li>Analysis Module-Comprehensive (1x 2.850,00)</li>
                            <li>Cedex Integration Comprehensive - Cedex Cell Counter integrated to ambr, NOT supplied and supported by Sartorius (1x 4.700,00)</li>
                        </ul>
                    </td>
                    <td className={style.right}>&nbsp;</td>
                    <td className={style.right}>7.550,00</td>
                </tr>
            </tbody>
            <tbody><tr style={rowStyling}>
                    <td colspan="3" style={{borderTop: "1px solid #000", backgroundColor: "#f2f2f2"}}>&nbsp;</td>
                    <td className={style.right} style={{borderTop: "1px solid #000", backgroundColor: "#f2f2f2"}}>PeriodTotal</td>
                </tr>
            </tbody>

                        
            <thead style={{marginTop: "5mm"}}>
                <tr style={rowStyling}>
                    <th colspan="2" className={style.left}>ServicePeriodDescription</th>
                    <th className={style.right}>Gerätezahl</th>
                    <th className={style.right}>Preis in Currency</th>
                </tr>
            </thead>
            <tbody id="priceTable">
                <tr style={rowStyling}>
                    <td>1</td>
                    <td>Preis per Gerätegruppe ambr(R) 15 cc/24C</td>
                    <td className={style.right}>1</td>
                    <td className={style.right}>29.625,00</td>
                </tr>
                <tr style={rowStyling}>
                    <td>&nbsp;</td>
                    <td>
                        <ul>
                            <li>Analysis Module-Comprehensive (1x 2.850,00)</li>
                            <li>Cedex Integration Comprehensive - Cedex Cell Counter integrated to ambr, NOT supplied and supported by Sartorius (1x 4.700,00)</li>
                        </ul>
                    </td>
                    <td className={style.right}>&nbsp;</td>
                    <td className={style.right}>7.550,00</td>
                </tr>
            </tbody>
            <tbody><tr style={rowStyling}>
                    <td colspan="3" style={{borderTop: "1px solid #000", backgroundColor: "#f2f2f2"}}>&nbsp;</td>
                    <td className={style.right} style={{borderTop: "1px solid #000", backgroundColor: "#f2f2f2"}}>PeriodTotal</td>
                </tr>
            </tbody> */}

const siteheader = {
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "top",
    color: "#fff",
    height: "auto",
    fontSize: "12px"
    
};

const siteheaderTitle ={
    position: "relative",
    width: "100%",
    fontSize: "20px",
    fontWeight: "100",
    paddingTop: "25px",
    color: "#212121",
}
const steptwo ={
    position: "absolute",
    right: 0,
    bottom : 0,
}
const stepthree ={
    fontSize:"9px" , 
    marginTop: "150px"
}
const tableHead ={
    padding: "1px 10px",
    verticalAalign: "middle",
    height: "30px",
}
const minHeightPage ={
 minHeight: "841px",
 height: "100%",
}