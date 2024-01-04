import React, { useState, useEffect, useContext, useRef } from "react";
import PrintPreview from "../../components/printPreview/PrintPreview";
import WordPreview from "./../../components/wordPreview/WordPreview"
import { jsPDF } from "jspdf";
import style from "./quotation.module.css";
import Devices from "../../components/devices/Devices";
import Offers from "../../components/offers/Offers";
import Characteristics from "./../../components/characteristics/Characteristics"
import Listing from "../../components/listing/Listing";
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
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { axiosInstance } from "../../config";
import { Context } from "../../context/Context";
import { useLocation } from "react-router-dom";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { renderToString } from "react-dom/server";
import parse from 'html-react-parser';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const deciceListObject = {
  deviceName: "",
  serviceGroup: "",
  serialNumber:"",
  equipmentNumber:"",
  location:"",
  date: ""
}


const listingObject = {
  name: "",
  startDate: "",
  endDate: "",
  deviceGroups: [{
    groupName: "",
    devices: [{
      deviceName: "",
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
  }],
  travelCosts: [{
    _id: "",
    travelCostName: "",
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



function CustomTabPanel(props) { 
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function a11yProps1(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const html = '<div class="mainDiv"></div>';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});


export default function Quotations() {
  const [quotationsList, setsQuotationsList] = useState([])
  const [companies, setCompanies] = useState([])
  const [showQuotation,setShowQuotation] = useState(false)
  const [singleQuote, setSingleQuote] = useState({})
  const [id, setId] = useState("")
  const [open, setOpen] = useState(false);
  const [valueOne, setValueOne] = useState(0);
  const [valueTwo, setValueTwo] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const { user } = useContext(Context);
  const [translations, setTranslations] = useState(user.data.language.translations)
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [pricings , setPricings] = useState([])
  const [templates, setTemplates] = useState([])
  const [customers, setCustomers] = useState([])
  // const [contacts, setContacts] = useState([])
  const [contact, setContact] = useState({})
  const [contact2, setContact2] = useState({})
 	const reportTemplateRef = useRef(null);
  const [tPrice, setTPrice] = useState(0);
  const [template, setTemplate] = useState({})
  const [owner, setOwner] = useState({})
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  
  // states created by abbas==========================
  const [priceTableArray, setPriceTableArray] = useState([]);
  const [optionalsArray, setOptionalsArray] = useState([])
  const [travelCostsArray, setTravelCostsArray] = useState([])
  const [servicesArray, setServicesArray] = useState([]);
  const [priceVersionArray2, setPriceVersionArray] = useState([]);
  const [deviceList, setDeviceList] = useState([
    {
      deviceName: "",
      serviceGroup: "",
      equipmentNumber:"",
      location:"",
      date: ""
    }
  ]);

  const [serviceGroup, setServiceGroup] = useState("")
  const [companyID, setCompanyID] = useState(user.data.company ? user.data.company.ident : "")
  const [customer, setCustomer] = useState({})  
  const [endCustomer, setEndCustomer] = useState({})
  const [priceVersion, setPriceVersion] = useState("")
  const [quotePrice, setQuotePrice] = useState(0)
  const [optionDisabled, setOptionDisabled] = useState(true)
  const [saveButton, setSaveButton] = useState(true)
  const [listings, setListings] = useState([{
    name: "",
    startDate: "",
    endDate: "",
    deviceGroups: [{
      groupName: "",
      devices: [{
        deviceName: "",
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
        itemNumber: "",
        quantity: 1,
        discountPercent: 0,
        price: 0,
        totalDiscountedPrice:0,
        hours: 0,
        totalHours: 0,
      }]
    }],
    travelCosts: [{
      _id:"",
      travelCostName: "",
      itemNumber: "",
      quantity: 1,
      discountPercent: 0,
      price: 0,
      totalDiscountedPrice:0,
      hours: 0,
      totalHours: 0,
    }],
    totalPrice: 0
  }])

  const [offers, setOffers] = useState({
    location: user.data.company ? user.data.company.ident : "",
    offerNumber: "",
    revision: 0,
    currency: "euro",
    maintenance: "",
    priceVersion :"",
    exchangeRate: 1,
    paymentDays: "",
    validDate: "",
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPlaceOrderButton, setShowPlaceOrderButton] = useState(false)

  // Effects================================

  useEffect(() => {
    fetchQuotations()
    fetchCompanies()
    fetchPricings()
    fetchCustomers()
    fetchTemplates()
  },[])

  useEffect(() => {
    if(path && path.length > 0 && quotationsList.length > 0 && pricings.length>0){
      const quote = quotationsList.filter((q) => q['_id'] == path)
      setSingleQuote(quote[0])
      setId(path)
  
      offers['location'] = quote[0]['location']
      offers['offerNumber'] = quote[0]['offerNumber']
      offers['revision'] = quote[0]['revision']
      offers['could'] = quote[0]['could'] ? quote[0]['could']['_id']: ""
      offers['endCustomer'] = quote[0]['endCustomer'] ? quote[0]['endCustomer']['_id']: ""
      offers['currency'] = quote[0]['currency']
      offers['maintenance'] = quote[0]['maintenance']
      offers['priceVersion'] = quote[0]['priceVersion']
      offers['exchangeRate'] = parseFloat(quote[0]['exchangeRate'])
      offers['paymentDays'] = quote[0]['paymentDays']
      offers['validDate'] =  quote[0]['validDate']
      offers['createdDate'] = new Date(quote[0]['date']).toLocaleDateString().split("/") [0] + "." + new Date(quote[0]['date']).toLocaleDateString().split("/")[1] + "." + new Date(quote[0]['date']).toLocaleDateString().split("/")[2]
      
      const eR = parseFloat(quote[0]['exchangeRate'])
      setQuotePrice(quote[0]['quotePrice'] / quote[0]['exchange'])
      setOwner(quote[0]['owner'])
      if(quote[0]['contact'] && quote[0]['contact'].length > 0){
        const thisContact = quote[0]['could']['contact'].filter((con) => quote[0]['contact'] == con['_id'])
        setContact(thisContact[0])
      }
      if(quote[0]['contact2'] && quote[0]['contact2'].length > 0){
        const thisContact = quote[0]['could']['contact'].filter((con) => quote[0]['contact2'] == con['_id'])
        setContact2(thisContact[0])
      }
      setTPrice(quote[0]['quotePrice'])
      // setTPrice()
      setListings(quote[0]['quotations'])
      setDeviceList(quote[0]['devices'])
      setCustomer(quote[0]['could'])
      setEndCustomer(quote[0]['endCustomer'])
      const filteredArray  = pricings.filter((inc) => inc['service'] == quote[0]['maintenance'] && inc['priceVersion'] == quote[0]['priceVersion'] && inc['company_id'] == quote[0]['location'])
      const filteredOptionalsArray = pricings.filter((inc) => inc['priceVersion'] == quote[0]['priceVersion'] && inc['company_id'] == quote[0]['location'] && inc['materialGroup'] && inc['materialGroup'].includes("Optional"))
      const filteredTravelCostsArray = pricings.filter((inc) => inc['priceVersion'] == quote[0]['priceVersion'] && inc['company_id'] == quote[0]['location'] && inc['materialGroup'] &&  inc['materialGroup'].includes("Travelcosts"))
      setOptionalsArray(filteredOptionalsArray)
      setTravelCostsArray(filteredTravelCostsArray)
      setPriceTableArray(filteredArray)
      setServiceGroup(quote[0]['maintenance'])
      setCompanyID(quote[0]['location'])
      setPriceVersion(quote[0]['priceVersion']) 
  
  
      
  
      const justAnArrayForServices = []
      for(let x of pricings){
        if(x['company_id'] == quote[0]['location']){
          if(!justAnArrayForServices.includes(x['service'])){
            justAnArrayForServices.push(x['service'])
          }
        }
      }
      setServicesArray(justAnArrayForServices)
  
      const justAnArrayForPriceVersions = []
      for(let x of pricings){
        if(x['company_id'] == quote[0]['location'] && x['service'] == quote[0]['maintenance']){
          if(!justAnArrayForPriceVersions.includes(x['priceVersion'])){
            justAnArrayForPriceVersions.push(x['priceVersion'])
          }
        }
      }
      setPriceVersionArray(justAnArrayForPriceVersions)
      // offers['maintenance'] = e.target.value
      // setOffers({...offers})
      // calculateTotalPrice()
      handleClickOpen()
    }
  }, [quotationsList, pricings])

  useEffect(() => {
    if(companyID.length > 0 && pricings.length > 0){
      const filteredArray  = pricings.filter((inc) => inc['company_id'] == companyID)
      const filteredOptionalsArray = filteredArray.filter((inc) => inc['materialGroup'] && inc['materialGroup'].includes("Optional") )
      const filteredTravelCostsArray = filteredArray.filter((inc) => inc['materialGroup'] && inc['materialGroup'].includes("Travelcosts"))
  
      setOptionalsArray(filteredOptionalsArray)
      setTravelCostsArray(filteredTravelCostsArray)
  
      const justAnArray = []
      for(let x of filteredArray){
        if(!justAnArray.includes(x['service'])){
          justAnArray.push(x['service'])
        }
      }
      setServicesArray(justAnArray)
    }
  },[pricings])

  // functions by abbas=====================
  const calculateTotalPrice = ()  => {
    let completeTotalCost = 0

    for(let i=0; i < listings.length; i++){
      let cost = 0;

      for(let j=0; j < listings[i]['deviceGroups'].length; j++){
        for(let k=0; k < listings[i]['deviceGroups'][j]['devices'].length; k++){
          cost = cost + Number(listings[i]['deviceGroups'][j]['devices'][k]['totalDiscountedPrice'])
        }
        for(let k=0; k < listings[i]['deviceGroups'][j]['optionals'].length; k++){
          cost = cost + Number(listings[i]['deviceGroups'][j]['optionals'][k]['totalDiscountedPrice'])
        }
      }

      for(let j=0; j < listings[i]['travelCosts'].length; j++){
        cost = cost + listings[i]['travelCosts'][j]['totalDiscountedPrice']
      }

      listings[i]['totalPrice'] = cost 
      completeTotalCost = completeTotalCost + cost
      setListings([...listings])

    }
      setQuotePrice(completeTotalCost)
      setTPrice(completeTotalCost * offers['exchangeRate'])
  }
  const handleOpenCreateQuotation = () => {
    if(path && path.length > 0 && quotationsList.length > 0 && pricings.length>0){
      const quote = quotationsList.filter((q) => q['_id'] == path)
      setSingleQuote(quote[0])
      setId(path)
  
      offers['location'] = quote[0]['location']
      offers['offerNumber'] = quote[0]['offerNumber']
      offers['revision'] = quote[0]['revision']
      offers['could'] = quote[0]['could'] ? quote[0]['could']['_id']: ""
      offers['endCustomer'] = quote[0]['endCustomer'] ? quote[0]['endCustomer']['_id']: ""
      offers['currency'] = quote[0]['currency']
      offers['maintenance'] = quote[0]['maintenance']
      offers['priceVersion'] = quote[0]['priceVersion']
      offers['exchangeRate'] = parseFloat(quote[0]['exchangeRate'])
      offers['paymentDays'] = quote[0]['paymentDays']
      offers['validDate'] =  quote[0]['validDate']
      offers['date'] = new Date(quote[0]['date']).toLocaleDateString().split("/") [0] + "." + new Date(quote[0]['date']).toLocaleDateString().split("/")[1] + "." + new Date(quote[0]['date']).toLocaleDateString().split("/")[2]
      offers['createdDate'] = new Date(quote[0]['date']).toLocaleDateString().split("/") [0] + "." + new Date(quote[0]['date']).toLocaleDateString().split("/")[1] + "." + new Date(quote[0]['date']).toLocaleDateString().split("/")[2]
      const eR = parseFloat(quote[0]['exchangeRate'])
      setQuotePrice(quote[0]['quotePrice'] / quote[0]['exchange'])
      setOwner(quote[0]['owner'])
      if(quote[0]['contact'] && quote[0]['contact'].length > 0){
        const thisContact = quote[0]['could']['contact'].filter((con) => quote[0]['contact'] == con['_id'])
        setContact(thisContact[0])
      }
      if(quote[0]['contact2'] && quote[0]['contact2'].length > 0){
        const thisContact = quote[0]['could']['contact'].filter((con) => quote[0]['contact2'] == con['_id'])
        setContact2(thisContact[0])
      }
      setTPrice(quote[0]['quotePrice'])
      // setTPrice()
      setListings(quote[0]['quotations'])
      setDeviceList(quote[0]['devices'])
  
      const filteredArray  = pricings.filter((inc) => inc['service'] == quote[0]['maintenance'] && inc['priceVersion'] == quote[0]['priceVersion'] && inc['company_id'] == quote[0]['location'])
      const filteredOptionalsArray = pricings.filter((inc) => inc['priceVersion'] == quote[0]['priceVersion'] && inc['company_id'] == quote[0]['location'] && inc['serviceGroup'].includes("Kalibrierequip"))
      const filteredTravelCostsArray = pricings.filter((inc) => inc['priceVersion'] == quote[0]['priceVersion'] && inc['company_id'] == quote[0]['location'] && inc['service'].includes("Reisekosten"))
      setOptionalsArray(filteredOptionalsArray)
      setTravelCostsArray(filteredTravelCostsArray)
      setPriceTableArray(filteredArray)
      setServiceGroup(quote[0]['maintenance'])
      setCompanyID(quote[0]['location'])
      setPriceVersion(quote[0]['priceVersion']) 
  
  
      
  
      const justAnArrayForServices = []
      for(let x of pricings){
        if(x['company_id'] == quote[0]['location']){
          if(!justAnArrayForServices.includes(x['service'])){
            justAnArrayForServices.push(x['service'])
          }
        }
      }
      
      setServicesArray(justAnArrayForServices)
  
      const justAnArrayForPriceVersions = []
      for(let x of pricings){
        if(x['company_id'] == quote[0]['location'] && x['service'] == quote[0]['maintenance']){
          if(!justAnArrayForPriceVersions.includes(x['priceVersion'])){
            justAnArrayForPriceVersions.push(x['priceVersion'])
          }
        }
      }
      setPriceVersionArray(justAnArrayForPriceVersions)
      // offers['maintenance'] = e.target.value
      // setOffers({...offers})
      // calculateTotalPrice()
      handleClickOpen()
    }else{
      handleClickOpen()
    }
  }
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleOpenEditQuotation = (e, qid)=>{
    const quote = quotationsList.filter((q) => q['_id'] == qid)
    setSingleQuote(quote[0])
    setId(qid)

    offers['location'] = quote[0]['location']
    offers['offerNumber'] = quote[0]['offerNumber']
    offers['revision'] = quote[0]['revision']
    offers['could'] = quote[0]['could'] ? quote[0]['could']['_id']: ""
    offers['endCustomer'] = quote[0]['endCustomer'] ? quote[0]['endCustomer']['_id']: ""
    offers['currency'] = quote[0]['currency']
    offers['maintenance'] = quote[0]['maintenance']
    offers['priceVersion'] = quote[0]['priceVersion']
    offers['exchangeRate'] = parseFloat(quote[0]['exchangeRate'])
    offers['paymentDays'] = quote[0]['paymentDays']
    offers['validDate'] =  quote[0]['validDate'] //17/11/2023
    offers['createdDate'] = quote[0]['date']
    // offers['createdDate'] = new Date(quote[0]['date']).toLocaleDateString().split("/") [1] + "." + new Date(quote[0]['date']).toLocaleDateString().split("/")[0] + "." + new Date(quote[0]['date']).toLocaleDateString().split("/")[2]
    const eR = parseFloat(quote[0]['exchangeRate'])
    setQuotePrice(quote[0]['quotePrice'] / quote[0]['exchange'])
    setOwner(quote[0]['owner'])
    
    if(quote[0]['contact'] && quote[0]['contact'].length > 0){
      const thisContact = quote[0]['could']['contact'].filter((con) => quote[0]['contact'] == con['_id'])
      setContact(thisContact[0])
    }
    if(quote[0]['contact2'] && quote[0]['contact2'].length > 0){
      const thisContact = quote[0]['could']['contact'].filter((con) => quote[0]['contact2'] == con['_id'])
      setContact2(thisContact[0])
    }
    setTPrice(quote[0]['quotePrice'])
    // setTPrice()
    setListings(quote[0]['quotations'])
    setDeviceList(quote[0]['devices'])

    // const thisCustomer = customers.filter
    setCustomer(quote[0]['could'])
    setEndCustomer(quote[0]['endCustomer'])

    const filteredArray  = pricings.filter((inc) => inc['service'] == quote[0]['maintenance'] && inc['priceVersion'] == quote[0]['priceVersion'] && inc['company_id'] == quote[0]['location'])
    const filteredOptionalsArray = pricings.filter((inc) => inc['priceVersion'] == quote[0]['priceVersion'] && inc['company_id'] == quote[0]['location'] && inc['materialGroup'] && inc['materialGroup'].includes("Optional"))
    const filteredTravelCostsArray = pricings.filter((inc) => inc['priceVersion'] == quote[0]['priceVersion'] && inc['company_id'] == quote[0]['location'] && inc['materialGroup'] && inc['materialGroup'].includes("Travelcosts"))
    setOptionalsArray(filteredOptionalsArray)
    setTravelCostsArray(filteredTravelCostsArray)
    setPriceTableArray(filteredArray)
    setServiceGroup(quote[0]['maintenance'])
    setCompanyID(quote[0]['location'])
    setPriceVersion(quote[0]['priceVersion']) 



    

    const justAnArrayForServices = []
    for(let x of pricings){
      if(x['company_id'] == quote[0]['location']){
        if(!justAnArrayForServices.includes(x['service'])){
          justAnArrayForServices.push(x['service'])
        }
      }
    }
    setServicesArray(justAnArrayForServices)

    const justAnArrayForPriceVersions = []
    for(let x of pricings){
      if(x['company_id'] == quote[0]['location'] && x['service'] == quote[0]['maintenance']){
        if(!justAnArrayForPriceVersions.includes(x['priceVersion'])){
          justAnArrayForPriceVersions.push(x['priceVersion'])
        }
      }
    }
    setPriceVersionArray(justAnArrayForPriceVersions)
    // offers['maintenance'] = e.target.value
    // setOffers({...offers})
    // calculateTotalPrice()
    handleClickOpen()
  }
  const handleSeleteOption = async(e) => {
    if(e.target.value == 0){
      setId("")

    }else if(e.target.value == 1){
      if(Object.keys(singleQuote).length > 0){
        setShowDeleteDialog(true)
      }
    }
  }
  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false)
  }
  const handleDeleteQuotation = async() => {
    const res = await axiosInstance.post("/quotation/delete/" + singleQuote['_id'], {token: user.data.token})
        if(res.data.status == true){
          setError(false)
          setSuccessMsg(res.data.message)
          setSuccess(true)
          setShowDeleteDialog(false)
          setOpen(false)
          fetchQuotations()
        }else{
          setSuccess(false)
          setSuccessMsg(res.data.message)
          setError(true)
        }
  }
  const handleClose = () => {
    const offersObject = {
      location: user.data.company ? user.data.company.ident : "",
      offerNumber: "",
      revision: 0,
      currency: "euro",
      could: "",
      endCustomer: "",
      maintenance: "",
      priceVersion :"",
      exchangeRate: 1
    }
    setOffers(offersObject)
    const justAnArray = []
    justAnArray.push(listingObject)
    setListings(justAnArray)
    setServiceGroup("")        
    setPriceVersion("") 
    const deviceListArray = []
    deviceListArray.push(deciceListObject)
    setDeviceList(deviceListArray)
    setId("")
    setPriceTableArrayFunction()
    // fetchQuotations()
    setOpen(false);
  };
  const handleChangeOne = (event, newValue) => {
    setValueOne(newValue);
  };
  const handleChangeTwo = (event, newValue) => {
    setValueTwo(newValue);
  };
  const handleAddNewListing = () => {
    const newLisingObject = JSON.stringify(listings[listings.length - 1])
    const listObj = JSON.parse(newLisingObject)
// -------------------------------------------
    const date_1 = new Date(listObj.endDate)
    const diff = 1 * 1000 * 3600 * 24
    const timeStamp_1 = date_1.getTime()

    const timeStamp_2 = timeStamp_1 + diff
    const date_2 = new Date(timeStamp_2)
// -------------------------------------------

    const date_3 = new Date(date_2)
    const diff2 = 364 * 1000 * 3600 * 24
    const timeStamp_3 = date_3.getTime()

    const timeStamp_4 = timeStamp_3 + diff2
    const date_4 = new Date(timeStamp_4)

// -------------------------------------------
    
    listObj['startDate'] = date_3.toLocaleDateString('fr-CA')
    listObj['endDate'] = date_4.toLocaleDateString('fr-CA')
    listings.push(listObj)
    setListings([...listings])
    calculateTotalPrice()
  };
  const handleRemoveListing = (e, listindex) => {
    listings.splice(listindex, 1)
    setListings([...listings])
  };
  const handleAddDevices = (e) => {
    const newDeviceListObject = JSON.stringify(deciceListObject)
    const deviceListObj = JSON.parse(newDeviceListObject)
    deviceList.push(deviceListObj)
    setDeviceList([...deviceList])
  }
  const handleSaveQuotation = async() => {
      const quotation = {
        location: offers['location'],
        offerNumber: offers['offerNumber'],
        revision: offers['revision'],
        could : offers['could'],
        endCustomer: offers['endCustomer'],
        contact: contact['_id'],
        contact2: contact2['_id'],
        currency: offers['currency'],
        maintenance: offers['maintenance'],
        priceVersion: offers['priceVersion'],
        exchangeRate: offers['exchangeRate'],        
        paymentDays: offers['paymentDays'],
        validDate: offers['validDate'],
        quotations: listings,
        devices: deviceList,
        quotePrice: quotePrice * offers['exchangeRate'],
        owner: owner ? owner['_id'] : user.data._id
      }
      if(owner){
        quotation['owner'] = owner['_id']
      }
      const res = await axiosInstance.post("/quotation/create", {
        token: user.data.token,
        quotation: quotation
      }) 
      if(res.data.status == true){
        setId(res.data.data['_id'])
        setError(false)
        setSuccess(true)
        setSuccessMsg(res.data.message)

      }else{   
        setSuccess(false)
        setError(true)
        setErrorMsg(res.data.message)
      }
    
  }
  const handleEditQuotation = async() => {
    if(id.length > 0){
    // if(!owner){
    //   setSuccess(false)
    //   setError(true)
    //   setErrorMsg("Please select an owner!")
    // }else{
      const quotation = {
        location: offers['location'],
        offerNumber: offers['offerNumber'],
        revision: offers['revision'],
        could : offers['could'],
        contact: contact['_id'],
        contact2: contact2['_id'],
        endCustomer: offers['endCustomer'],
        currency: offers['currency'],
        maintenance: offers['maintenance'],
        priceVersion: offers['priceVersion'],
        exchangeRate: offers['exchangeRate'],    
        paymentDays: offers['paymentDays'],
        validDate: offers['validDate'],
        quotations: listings,
        devices: deviceList,
        quotePrice: tPrice,
        owner: owner !== undefined ? owner['_id'] : user.data._id,
        lastModifiedBy: user.data.firstname + " " + user.data.lastname,
        lastModifiedDate: Date.now()
      }

      const res = await axiosInstance.put("/quotation/update/" + id , {
        token: user.data.token,
        quotation: quotation
      }) 
      if(res.data.status == true){
        
        setError(false)
        setSuccess(true)
        setSuccessMsg(res.data.message)
        fetchQuotations()
        // handleClose()
      }else{
        setSuccess(false)
        setError(true)
        setErrorMsg(res.data.message)
      }
    }
    // }
  }
  const handleTest = ( ) => {
  }
  const handleEmpytServiceGroupInDeviceList = () => {
    for(let x of deviceList){
      x['serviceGroup'] = ""
    }
    setDeviceList([...deviceList])

    for(let i=0; i < listings.length; i++){
      for(let j=0; j < listings[i]['deviceGroups'].length; j++){
        for(let k=0; k < listings[i]['deviceGroups'][j]['devices'].length; k++){
          listings[i]['deviceGroups'][j]['devices'][k]['deviceName'] =  ""
          listings[i]['deviceGroups'][j]['devices'][k]['itemNumber'] =  ""
          listings[i]['deviceGroups'][j]['devices'][k]['quantity'] =  1
          listings[i]['deviceGroups'][j]['devices'][k]['discountPercent'] =  0
          listings[i]['deviceGroups'][j]['devices'][k]['price'] =  0
          listings[i]['deviceGroups'][j]['devices'][k]['totalDiscountedPrice'] = 0
          listings[i]['deviceGroups'][j]['devices'][k]['hours'] =  0
          listings[i]['deviceGroups'][j]['devices'][k]['totalHours'] =  0
        }
        for(let k=0; k < listings[i]['deviceGroups'][j]['optionals'].length; k++){
          listings[i]['deviceGroups'][j]['optionals'][k]['_id'] =  ""
          listings[i]['deviceGroups'][j]['optionals'][k]['optionalName'] =  ""
          listings[i]['deviceGroups'][j]['optionals'][k]['itemNumber'] =  ""
          listings[i]['deviceGroups'][j]['optionals'][k]['quantity'] =  1
          listings[i]['deviceGroups'][j]['optionals'][k]['discountPercent'] =  0
          listings[i]['deviceGroups'][j]['optionals'][k]['price'] =  0
          listings[i]['deviceGroups'][j]['optionals'][k]['totalDiscountedPrice'] = 0
          listings[i]['deviceGroups'][j]['optionals'][k]['hours'] =  0
          listings[i]['deviceGroups'][j]['optionals'][k]['totalHours'] =  0
        }
      }
      for(let j=0; j < listings[i]['deviceGroups'].length; j++){
          listings[i]['travelCosts'][j]['_id'] =  ""
          listings[i]['travelCosts'][j]['deviceName'] =  ""
          listings[i]['travelCosts'][j]['itemNumber'] =  ""
          listings[i]['travelCosts'][j]['quantity'] =  1
          listings[i]['travelCosts'][j]['discountPercent'] =  0
          listings[i]['travelCosts'][j]['price'] =  0
          listings[i]['travelCosts'][j]['totalDiscountedPrice'] = 0
          listings[i]['travelCosts'][j]['hours'] =  0
          listings[i]['travelCosts'][j]['totalHours'] =  0
        
      }
      listings[i]['totalPrice'] = 0;

      // for(let j=0; j < listings[i]['travelCosts'].length; j++){
      // }

    }
    
    setListings([...listings])
    // if(!deviceList[0]['deviceName'].length > 0){

    // }
  }
  const handleReFillPrice = (array) => {
    const justNewArray = listings

    for(let listing of justNewArray){
      for(let deviceGroup of listing['deviceGroups']){
        for(let device of deviceGroup['devices']){
          for(let x of array){
            if(x['material'] == device['itemNumber']){
              device['price'] = x['price']
              device['hours'] = x['workingTime']
              device['totalDiscountedPrice'] = Math.round(device['quantity'] * (Number(x['price']) / 100) * (100 - device['discountPercent']))
              device['totalHours'] = device['quantity'] * x['workingTime']
              device['found'] = true
              break;
            }
            else{
              if(device['itemNumber'].length > 0){
                device['price'] = ""
                device['hours'] = 0
                device['totalDiscountedPrice'] = 0
                device['totalHours'] = 0
                device['found'] = false
              }
            }
          }
        }
      }
    }
    setListings(justNewArray)
    calculateTotalPrice()

  }
  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    // setOpen(false);

    setError(false);
  };

  const testing = ( ) => {
    let htmlElement = (
      // <>
          <div className={style.printbody}>
              <div className={style.a4container}>
                <div className={style.printheader}>
                    <div className={style.sitelogo}>Logo</div>
                    <div className={style.siteheader}>
                        <p>Header Seite 1</p>
                        <p>Header Seite 1</p>
                    </div>
                </div>
                <div className={style.printcontent}>
                    {/* <!-- Seite 1 Inhalt --> */}
                    <div className={style.conntentheader}>Seite 1</div>
                    <p>Dies ist der Inhalt von Seite 1.</p>
                    <p>This Text should be mapped: {user.data.company ? user.data.company.name + " " + user.data.company.ident : ""}</p>
                    <p>This Text should be mapped: {user.data.company ? user.data.company.name + " " + user.data.company.ident : ""}</p>   <p>This Text should be mapped: {user.data.company ? user.data.company.name + " " + user.data.company.ident : ""}</p>
                    <p>This Text should be mapped: {user.data.company ? user.data.company.name + " " + user.data.company.ident : ""}</p>
                    <p>This Text should be mapped: {user.data.company ? user.data.company.name + " " + user.data.company.ident : ""}</p>
                    <p>This Text should be mapped: {user.data.company ? user.data.company.name + " " + user.data.company.ident : ""}</p>
                
                
                </div>
                <div className={style.printfooter}>
                    {/* <!-- Footer-Inhalt hier einfügen --> */}
                    <p>Seite 1</p>
                </div>
              </div>

              {/* <div className={style.a4container}>
                  <div className={style.printheader}>
                      <div className={style.sitelogo}>Logo</div>
                      <div className={style.siteheader}>
                          <p>Header Seite 2</p>
                          <p>Header Seite 2</p>
                      </div>
                  </div>
                  <div className={style.printcontent}>
                      <div className={style.conntentheader}>Seite 2</div>
                      <p>Dies ist der Inhalt von Seite 2.</p>
                  </div>
                  <div className={style.printfooter}>
                      <p>Seite 2</p>
                  </div>
              </div>
              <div className={style.a4container}>
                  <div className={style.printheader}>
                      <div className={style.sitelogo}>Logo</div>
                      <div className={style.siteheader}>
                          <p>Header Seite 3</p>
                          <p>Header Seite 3</p>
                      </div>
                  </div>
                  <div className={style.printcontent}>
                      <div className={style.conntentheader}>Seite 3</div>
                      <p>Dies ist der Inhalt von Seite 3.</p>
                  </div>
                  <div className={style.printfooter}>
                      <p>Seite 3</p>
                  </div>
              </div> */}
            </div> 
      // </>
   )
   let elementAsString = renderToString(htmlElement);
   let doc = new jsPDF('p', 'px', [800, 1200]);
  //  let doc = new jsPDF('p', 'mm', "a4");
  //  let width = doc.internal.pageSize.getWidth();
  //  let height = doc.internal.pageSize.getHeight()
   
   doc.html(elementAsString, {
      callback: function (doc) {
         window.open(doc.output('bloburl'), '_blank');
      },
      x: 10,
      y: 10
   });
  }

  // set price table array function

  const setPriceTableArrayFunction = (array) => {
    const pta = pricings.filter((re) => {
      if(re['materialGroup']){
        return re['materialGroup'].includes("Maintenance")
      } 
    })

    setPriceTableArray(pta)
  }



  // ===========static function==================
  const fetchQuotations = async() =>{
    
    setShowPlaceOrderButton(true)
    const res = await axiosInstance.post("/quotation/fetchAll", {token: user.data.token})
    if(res.data.status == true){
      setShowPlaceOrderButton(false)
      setShowQuotation(true)
      setsQuotationsList(res.data.data)
    }else{
      setShowPlaceOrderButton(false)
    }
  }

    const fetchPricings = async() =>{
    const res = await axiosInstance.post("/pricing/fetchAll", {token: user.data.token})
    // const arr1 = []
    // const arr2 = []
    // const arr3 = []
    if(res.data.status == true){
      // for(let x of res.data.data){
      //   if(x['serviceGroup'] == "Kalibrierung"){
      //     arr1.push(x)
      //   }else if(x['serviceGroup'] == "Reisekosten"){
      //     arr2.push(x)
      //   }else{
      //     arr3.push(x)
      //   }
      // }
      setPricings(res.data.data)
      const pta = res.data.data.filter((re) => {
        if(re['materialGroup']){
          return re['materialGroup'].includes("Maintenance")
        } 
      })

      setPriceTableArray(pta)
      // setOptionalsArray(arr2)
      // setTravelCostsArray(arr1)
    }
  }

  const fetchCompanies = async() => {
    const res = await axiosInstance.post("/companies/fetchAll", {token: user.data.token})
    if(res.data.status == true){
      setCompanies(res.data.data)
    }
  }


  const fetchCustomers = async() => {
    const res = await axiosInstance.post("/customer/fetchAll", {token: user.data.token})
    if(res.data.status == true){
      setCustomers(res.data.data)
    }
  }

  const fetchTemplates = async() => {
    setShowPlaceOrderButton(true)
    const res = await axiosInstance.post("/templates/fetchAll", {
      token: user.data.token
    })

    if(res.data.status == true){
    const newMappedArray = res.data.data.map((temp) => {
      return temp.templateString.replace(/&lt;/g, "<")
    })
    setTemplates(newMappedArray)
    }else{
    setShowPlaceOrderButton(false)
      setTemplates([])
    }
  }
  const options = { 
    replace: (domNode) => {
      if(domNode.attribs && domNode.attribs.class === 'mainDiv'){
        if(customer){
          return(template.templateString)
        }
      }



    // if (domNode.attribs && domNode.attribs.class === 'templateName') {
    //     if(customer){
    //         return(
    //           <><p>{template['name']}</p>
    //           {
    //             customers.map((cust) =>{
    //               return(<h1>{template['name']}</h1>)
    //             })
    //           }
    //           <p>{template['name']}</p></>
    //         )
    //     }
    // }
    //   if (domNode.attribs && domNode.attribs.class === 'customerName') {
    //     if(customer){
    //       return <>{"Customer name: " + customer['name']}</>;
    //     }
    //   }
    //   if (domNode.attribs && domNode.attribs.class === 'customerNumber') {
    //     if(customer){
    //       return <>{"Customer Number: " + customer['customerNumber']}</>;
    //     }
    //   }
    //   if (domNode.attribs && domNode.attribs.class === 'customerStreetNumber') {
        
    //     if(customer){
    //       return <>{"Company Address Street Number: " + customer['streetnumber']}</>;
    //     }
    //   }
    //   if (domNode.attribs && domNode.attribs.class === 'customerZipCode') {
        
    //     if(customer){
    //       return <>{"Company Address Zipcode: " + customer['zipcode']}</>;
    //     }
    //   }
    //   if (domNode.attribs && domNode.attribs.class === 'customerCountry') {        
    //     if(customer){
    //       return <>{"Company Address Country: " + customer['country']}</>;
    //     }
    //   }
    //   if (domNode.attribs && domNode.attribs.class === 'offerNumber') {        
    //     if(customer){
    //       return <>{"Offer Number: " + offers['offerNumber']}</>;
    //     }
    //   }
    },
  }


  return (
    <section className={style.main_content}>
      <div className={style.container_fluid}>
        <div className={style.row}>
        <div className={style.optiondiv}>
        <Button
              sx={{
                backgroundColor: "#00B050",
                marginLeft: "auto",
                fontSize: "16px",
                color: "#fff",
                textTransform: "capitalize",
                fontWeight: "600",
                gap: "5px",
                padding: "8px 20px",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#09753a" },
              }}
              onClick={handleOpenCreateQuotation}
            >
              <FontAwesomeIcon icon={faSave} />
              {translations && translations['Create Quotation'] ? translations['Create Quotation'] : "{Create Quotation}"}
            </Button>
            
          </div>
          <div className={style.custom_col_outer}>
            <div className={style.table_responsive}>
              <table className={`${style.table} ${style.table_bordered}`}>
                <thead className={style.table_dark}>
                  <tr>
                    <th scope="col">Quotation No.</th>
                    <th scope="col">Revision</th>
                    <th scope="col">Date</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Owner</th>
                    <th scope="col">Last Modified Date</th>
                    <th scope="col">Last Modified by</th>
                    <th scope="col">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>

                  {
                    showQuotation && quotationsList.length > 0
                    ?
                    quotationsList.map((sing, index) => {
                      return(
                      <tr key={sing['_id']}>
                        <td className="td">{sing['offerNumber']}</td>
                        <td className="td">{sing['revision']}</td>
                        <td className="td">{new Date(sing['date']).toLocaleDateString()}</td>
                        <td className="td" style={{textTransform: "capitalize"}}>{sing['endCustomer'] ? sing['endCustomer']['name'] : ""}</td>
                        <td className="td">Mr.Smith</td>
                        <td className="td" style={{textTransform: "capitalize"}}>{sing['owner'] ? sing['owner']['firstname'] + " " + sing['owner']['lastname'] : "N/A"}</td>
                        <td className="td">{new Date(sing['lastModifiedDate']).toLocaleDateString()}</td>
                        <td className="td">{sing['lastModifiedBy']}</td>
                        <td className="td">
                          <button
                            type="button"
                            className={`${style.btn} ${style.edit_btn}`}
                            // onClick={handleClickOpen}
                            onClick={(e) => handleOpenEditQuotation(e, sing['_id'])}
                          >
                            <span>
                              <FontAwesomeIcon icon={faPen} />
                            </span>
                            Open Quotation
                          </button>
                        </td>
                      </tr>
                      )
                    })
                    :
                    <></>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{ marginTop: "110px", marginLeft: "20px", overflowY: "visible !important" }}
        className={style.Temp}
      >
        <AppBar sx={{ position: "sticky", backgroundColor:"white" }}>
          <Toolbar sx={{ backgroundColor: "white", color: "black" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {/* Sound */}
            </Typography>
            {id.length > 0
            ?
            <Button
              sx={{
                backgroundColor: "#00B050",
                fontSize: "16px",
                color: "#fff",
                textTransform: "capitalize",
                fontWeight: "600",
                gap: "5px",
                padding: "8px 20px",
                borderRadius: "10px",
                marginLeft: "20px",
                "&:hover": { backgroundColor: "#09753a" },
              }}
              onClick={handleEditQuotation}
            >
              <FontAwesomeIcon icon={faSave} />
              Speichern
            </Button>
            :
            <Button
              sx={{
                backgroundColor: "#00B050",
                fontSize: "16px",
                color: "#fff",
                textTransform: "capitalize",
                fontWeight: "600",
                gap: "5px",
                padding: "8px 20px",
                borderRadius: "10px",
                marginLeft: "20px",
                "&:hover": { backgroundColor: "#09753a" },
              }}
              disabled={saveButton ? false : true}
              onClick={handleSaveQuotation}
            >
              <FontAwesomeIcon icon={faSave} />
              Als neu speichern
            </Button>
            }
            
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
                marginLeft: "20px",
                "&:hover": { backgroundColor: "#292929" },
              }}
              // onClick={handleClose}
              onClick={testing}
              >
              <FontAwesomeIcon icon={faFileContract} />
              Drucken
            </Button>
              <select
             name="fdsfd" 
             id="sdfsdf"
             onChange={(e) => handleSeleteOption(e)}
             className={style.optionen}
             placeholder="Optionen"
             disabled={Object.keys(singleQuote).length > 0 ? false: true}
            >
              <option style={{fontSize: "16px", fontWeight: "600"}} disbled selected hidden>Optionen</option>
              <option style={{fontSize: "16px", fontWeight: "600", backgroundColor: "white", color: "black"}} value="0">Copy</option>            
              <option style={{fontSize: "16px", fontWeight: "600", backgroundColor: "white", color: "black"}} value="1" >Delete</option>
            </select>

          </Toolbar>
        </AppBar>

        <div className={style.dashBoard_Ui}>
          <Box sx={{ width: "40%" }}>
            <Box>
              <Tabs
                value={valueOne}
                onChange={handleChangeOne}
                aria-label="basic tabs example"
                textColor="#000000"
                indicatorColor="#ffffff"
              >
                <Tab
                  sx={valueOne === 0 ? btnActiveStyle : btnStyle}
                  label="Angebot"
                  {...a11yProps(0)}
                />
                <Tab
                  sx={valueOne === 1 ? btnActiveStyle : btnStyle}
                  label="Eigenschaften"
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
            {/* custom compoffers */}
            <CustomTabPanel value={valueOne} index={0}>
              <Offers 
              priceTableData = {pricings} 
              priceTableArray={priceTableArray} 
              setPriceTableArray={setPriceTableArray} 
              servicesArray={servicesArray}
              setServicesArray={setServicesArray}
              priceVersionArray2={priceVersionArray2}
              setPriceVersionArray={setPriceVersionArray}
              serviceGroup = {serviceGroup}
              setServiceGroup = {setServiceGroup}
              companyID = {companyID}
              setCompanyID = {setCompanyID}
              priceVersion = {priceVersion}
              setPriceVersion = {setPriceVersion}
              listings={listings}
              quotePrice = {quotePrice}
              setQuotePrice = {setQuotePrice}
              offers = {offers}
              setOffers = {setOffers}
              companies = {companies}
              handleEmpytServiceGroupInDeviceList = {handleEmpytServiceGroupInDeviceList}
              optionDisabled={optionDisabled}
              setOptionDisabled={setOptionDisabled}
              customers={customers}
              optionalsArray ={optionalsArray}
              setOptionalsArray ={setOptionalsArray}
              travelCostsArray ={travelCostsArray} 
              setTravelCostsArray={setTravelCostsArray}
              tPrice={tPrice}
              setTPrice={setTPrice}
              setCustomer={setCustomer}
              setEndCustomer= {setEndCustomer}
              handleReFillPrice = {handleReFillPrice}
              />
            </CustomTabPanel>
            {/* custom compchar */}
            <CustomTabPanel value={valueOne} index={1}>
              <Characteristics 
              template = {template} 
              setTemplate={setTemplate} 
              owner={owner} 
              setOwner={setOwner} 
              customer={customer} 
              contact={contact} 
              setContact={setContact}
              contact2={contact2} 
              setContact2={setContact2}
              offers={offers}
              setOffers={setOffers}
              />
            </CustomTabPanel>
          </Box>

          <Box sx={{ width: "100%" }}>
            <Box>
              <Tabs
                value={valueTwo}
                onChange={handleChangeTwo}
                aria-label="basic tabs example"
                textColor="#000000"
                indicatorColor="#ffffff"
              >
                <Tab sx={valueTwo === 0 ? btnActiveStyle : btnStyle} label={`Geräte`} {...a11yProps1(0)} />

                {
                listings.map((lists, listind) => {
                  return(
                      <Tab key={listind} sx={valueTwo === listind + 1 ? btnActiveStyle : btnStyle} label={`# ${listind + 1}`} {...a11yProps1(listind + 1)} onClick={() => setTabIndex(listind)}>
                      
                      </Tab>
                      
                     
                      
                  
                  )
                })
                } 
                <Tab label="+ New" sx={btnStyle} onClick={handleAddNewListing} />
                {/* <Tab label="Preview" sx={valueTwo === listings.length + 2 ? btnActiveStyle : btnStyle} {...a11yProps1(listings.length + 2)} onClick={() => setTabIndex(listings.length)} /> */}
                <Tab label="Preview 2" sx={valueTwo === listings.length + 2 ? btnActiveStyle : btnStyle} {...a11yProps1(listings.length + 2)} onClick={() => setTabIndex(listings.length)} />
             </Tabs>
            </Box>

            {/* custom compdevices */}
            <CustomTabPanel value={valueTwo} index={0} >              
              <Devices deviceList={deviceList} setDeviceList={setDeviceList} priceTableArray={priceTableArray} optionDisabled={optionDisabled} />
              <div style={{marginTop: "20px"}}>
                <button className={style.customBtn} onClick={handleAddDevices}>+ Devices</button>
              </div>
            </CustomTabPanel>

             {/* custom complistings */}
            {listings.map((listing, index) => {
              return (
                <CustomTabPanel value={valueTwo} index={index + 1} key={index}>
                  <Listing 
                    listing={listing} 
                    index={index} 
                    listings={listings} 
                    setListings={setListings} 
                    deviceList={deviceList} 
                    priceTableArray={priceTableArray} 
                    calculateTotalPrice = {calculateTotalPrice} 
                    optionalsArray ={optionalsArray}
                    setOptionalsArray ={setOptionalsArray}
                    travelCostsArray ={travelCostsArray} 
                    setTravelCostsArray={setTravelCostsArray}
                    setValueTwo={setValueTwo}
                    offers={offers}
                    />
                </CustomTabPanel>
              )
            })}
            {/* <CustomTabPanel value={valueTwo} index={listings.length + 2} className={style.customTabPanel}> 
             {/* {
              template.templateString
              ? 

              <>
              {parse(html, options)}
             </> 
              
               
              : 
              ""
            }  */}

            {/* <PrintPreview
            offers={offers}
            customer={customer}
            endCustomer={endCustomer}
            deviceList={deviceList}
            listings= {listings}
            contact={contact}
            companies = {companies}
            owner={owner}
            
            /> */}
            
             {/* <div style={{display:"flex"}}> */}
             
               {/* <PDFViewer style={{width: "100%", height: "500px"}}> */}
                {/* <PrintPreview/> */}
              {/* </PDFViewer> */} 
             {/* </div> */}
            
           {/* </CustomTabPanel> */} 
           
           <CustomTabPanel value={valueTwo} index={listings.length + 2} className={style.customTabPanel}> 
             {/* {
              template.templateString
              ? 

              <>
              {parse(html, options)}
             </> 
              
               
              : 
              ""
            }  */}

            <WordPreview
            
            template = {template}
            offers={offers}
            customer={customer}
            endCustomer={endCustomer}
            deviceList={deviceList}
            listings= {listings}
            contact={contact}
            companies = {companies}
            owner={owner}
            
            />
            
           </CustomTabPanel>
          </Box>
        </div>
      </Dialog>
 {/* circular progress loader dialogue */}

 <Dialog
        open={showPlaceOrderButton}
        // onClose={}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
        </DialogTitle>
        <DialogContent>
          <div>
            <CircularProgress/>
          </div>
        </DialogContent>
      </Dialog> 
      
            {/* delete pricings dialoge */}
            <Dialog
              open={showDeleteDialog}
              onClose={handleCloseDeleteDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Delete Quotation ?
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this quotation ? 
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                <Button onClick={handleDeleteQuotation} autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
            {/* delte pricings dialogue end */}
      {success && (
        <Snackbar open={success} autoHideDuration={2000} onClose={handleClose2}>
          <Alert
            onClose={handleClose2}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMsg}
          </Alert>
        </Snackbar>
      )}
      {error && (
        <Snackbar open={error} autoHideDuration={2000} onClose={handleClose2}>
          <Alert onClose={handleClose2} severity="error" sx={{ width: "100%" }}>
            {errorMsg}
          </Alert>
        </Snackbar>
      )}
    </section>
  );
}

const btnStyle = {
  backgroundColor: "#f2f2f2",
  textTransform: "capitalize",
  marginLeft: "20px",
  boxShadow: "5px 5px 7px #b5b5b5",
  fontWeight: 600,
  position: "relative"

};

const btnActiveStyle = {
  backgroundColor: "#ffffff",
  textTransform: "capitalize",
  marginLeft: "20px",
  boxShadow: "5px 5px 7px #b5b5b5",
  fontWeight: 600,
  position: "relative"
};


