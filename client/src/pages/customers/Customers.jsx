import React, { useState, useEffect, useContext } from "react";
import style from "./customers.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSave, faClose, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Time from "./../../assets/img/time-icon.svg";
import Quotations from "./../../assets/img/Quotations-icon.svg";
import Pricing from "./../../assets/img/Pricing-Table-icon.svg";
import Customer from "./../../assets/img/Customer-icon.png";
import Administration from "./../../assets/img/User-Administration.png";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { axiosInstance } from "../../config";
import { Context } from "../../context/Context";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// country list -----------------------------------

const countries = [
  "Afghanistan",
  "Åland Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas (the)",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia (Plurinational State of)",
  "Bonaire, Sint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory (the)",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cayman Islands (the)",
  "Central African Republic (the)",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands (the)",
  "Colombia",
  "Comoros (the)",
  "Congo (the Democratic Republic of the)",
  "Congo (the)",
  "Cook Islands (the)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czechia",
  "Côte d'Ivoire",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic (the)",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Falkland Islands (the) [Malvinas]",
  "Faroe Islands (the)",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories (the)",
  "Gabon",
  "Gambia (the)",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and McDonald Islands",
  "Holy See (the)",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran (Islamic Republic of)",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea (the Democratic People's Republic of)",
  "Korea (the Republic of)",
  "Kuwait",
  "Kyrgyzstan",
  "Lao People's Democratic Republic (the)",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands (the)",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia (Federated States of)",
  "Moldova (the Republic of)",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands (the)",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger (the)",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands (the)",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine, State of",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines (the)",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Republic of North Macedonia",
  "Romania",
  "Russian Federation (the)",
  "Rwanda",
  "Réunion",
  "Saint Barthélemy",
  "Saint Helena, Ascension and Tristan da Cunha",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin (French part)",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten (Dutch part)",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and the South Sandwich Islands",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan (the)",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Taiwan (Province of China)",
  "Tajikistan",
  "Tanzania, United Republic of",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands (the)",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates (the)",
  "United Kingdom of Great Britain and Northern Ireland (the)",
  "United States Minor Outlying Islands (the)",
  "United States of America (the)",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela (Bolivarian Republic of)",
  "Viet Nam",
  "Virgin Islands (British)",
  "Virgin Islands (U.S.)",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

const modulesObject = {
  dashboard: Time,
  quotations: Quotations,
  "pricing table": Pricing,
  customer: Customer,
  "user administration": Administration
}



export default function UserAdministration() {
  const [openModal, setOpenModal] = useState(false);  
  const [openModalCreateCustomer, setOpenModalCreateCustomer] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [name, setName] = useState("")
  const [customerNumber, setCustomerNumber] = useState("")
  const [country, setCountry] = useState("")
  const [streetNumber, setStreetNumber] = useState("") 
  const [zipCode, setZipCode] = useState("")
  const [checkboxItem, setCheckboxItem] = useState([])
  const { user } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteContactDialog, setShowDeleteContactDialog] = useState(false)
  const [showPlaceOrderButton, setShowPlaceOrderButton] = useState(false)
  const [contacts, setContacts] = useState([])
  const [contactID, setContactID] = useState("")
  const [filterName, setFilterName] = useState("")
  const [selectCustomerDialog, setSelectCustomerDialog] =useState(false)
  const [createContactDialog, setCreateContactDialog] =useState(false)
  const [editContactDialog, setEditContactDialog] = useState(false)
  const [customer, setCustomer] = useState({})
  const [telephone, setTelephone] = useState("")
  const [email, setEmail] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [contactAddress, setContactAddress] = useState("")
  const [contactZipcode, setContactZipcode] = useState("")
  const [customerSelected, setCustomerSelected] = useState(false)
  

  const fetchCustomer = async () => {
    setShowPlaceOrderButton(true)
    const res = await axiosInstance.post("customer/fetchAll", {
      token: user.data.token,
    });
    if(res.data.status == true){
      setCustomers(res.data.data);
      setShowPlaceOrderButton(false)
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  
  const dateFormat = (data) =>{
    const date = new Date(data);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hh = date.getHours();
    const mm = date.getMinutes();
    const ss = date.getSeconds();
    return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
  }
  const handleClickOpen = async(id) => {
    setCustomerId(id);
    const res = await axiosInstance.post(`customer/fetch/${id}`, {token : user.data.token})
    setName(res.data.data.name)
    setCustomerNumber(res.data.data.customerNumber)
    setCountry(res.data.data.country)
    setZipCode(res.data.data.zipcode)
    setStreetNumber(res.data.data.streetnumber)
    setContacts(res.data.data.contact)
    setOpenModal(true);

  };

  const handleCheckboxChange = async(e, module) =>{
    if(e.target.checked){
      setCheckboxItem([...checkboxItem, module])
    }else{
      const updatedSelectedItem = checkboxItem.filter(
        (selectedItem) => selectedItem !== module
      );
      setCheckboxItem(updatedSelectedItem);
    }
   }

  const handleEdit = async(e) => {
    e.preventDefault();
    const updateCustomer = {
      customer: {
        name: name,
        customerNumber: customerNumber,
        streetnumber: streetNumber,
        country: country,
        zipcode:zipCode
      },
      token: user.data.token
    };

    if (
      name === "" ||
      customerNumber == "" ||
      streetNumber === "" ||
      country === "" ||
      zipCode === ""
    ) {
      setOpen(true);
      setError(true);
      setErrorMsg("Please fill this input!");
    } else {
      // setIsLoading(true);
      const res = await axiosInstance.put(`/customer/update/${customerId}`, updateCustomer);
      if (res.data.status === true) {
        // setIsLoading(false);
        fetchCustomer();
        setOpen(true);
        setSuccess(true);
        setSuccessMsg(res.data.message);

        setName("")
        setCountry("")
        setZipCode("")
        setStreetNumber("")
        setCustomerNumber("")
        setOpenModal(false)
      } else {
        // setIsLoading(false);
        setOpen(true);
        setError(true);
        setErrorMsg(res.data.message);
      }
    }
   
  }

  const handleCreateCustomer = async(e) => {
    e.preventDefault();
    const createCustomer = {
      customer: {
        name: name,
        customerNumber: customerNumber,
        streetnumber: streetNumber,
        country: country,
        zipcode:zipCode
      },
      token: user.data.token
    };

    if (
      name === "" ||
      customerNumber == "" ||
      streetNumber === "" ||
      country === "" ||
      zipCode === ""
    ) {
      setOpen(true);
      setError(true);
      setErrorMsg("Please fill this input!");
    } else {
      const res = await axiosInstance.post("/customer/create", createCustomer);
      if (res.data.status === true) {

        fetchCustomer();
        setOpen(true);
        setSuccess(true);
        setSuccessMsg(res.data.message);
        handleModalCloseCreateCustomer()
        setName("")
        setCustomerNumber("")
        setCountry("")
        setZipCode("")
        setStreetNumber("")

      } else {
        setOpen(true);
        setError(true);
        setErrorMsg(res.data.message);
      }
    }
  }

  const handleOpenDeleteUser = (uid) => {
    if(user.data._id == uid){
      setSuccess(false)
      setError(true)
      setErrorMsg("Cannot Delete Yourself")
    }else{
      setShowDeleteDialog(true)
    }
  }
  const handleOpenDeleteContact = () =>{

  }

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false)
    setCustomerId("")
  }

  const handleDeleteUser = async () => {
    const res = await axiosInstance.post("/customer/delete/" + customerId, {
      token: user.data.token
    })

    if(res.data.status == true){      
      setError(false)
      setSuccess(true)
      setSuccessMsg(res.data.message)
      setCustomerId("")
      setShowDeleteDialog(false)
      setOpenModal(false)
      fetchCustomer()
    }else{
      setSuccess(false)
      setError(true)
      setErrorMsg(res.data.message)
    }


  }

  const handleModalClose = () => {
    setCustomerId("")
    setName("")
    setCustomerNumber("")
    setCountry("")
    setZipCode("")
    setStreetNumber("")
    setContacts([])
    setOpenModal(false);
  };

  const handleModalCloseCreateCustomer = ( ) => {
    setOpenModalCreateCustomer(false)
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setOpen(false);
    setError(false);
  };


  const handleSeleteOption = (e) => {
    if(e.target.value == 0){
      setOpenModalCreateCustomer(true)
    }else if(e.target.value == 1){
      setSelectCustomerDialog(true)
    }
  }

  const handleSelectCustomer = (e) => {
    const thisCustomer = customers.filter((cust) => cust['_id'] == e.target.value)
    if(thisCustomer.length > 0 ){
      setCustomerSelected(true)
      setCustomer(thisCustomer[0])
    }
  }

  const handlecustomerConfirmation = () => {
    if(customerSelected){
      setSelectCustomerDialog(false)
      setCreateContactDialog(true)
      setCustomerSelected(false)
    }
  }
  
  const handleCreateContactDialogClose = () =>{
    setCreateContactDialog(false)
  }

  const handleEditContactDialogClose = () => {
    setEditContactDialog(false)
  } 

  const handleSaveContactToCustomer = async() => {
    const thisContact = {
      contactPerson: contactPerson,
      contactAddress: contactAddress,
      contactZipcode: contactZipcode,
      telephone: telephone,
      email: email
    }
    const res = await axiosInstance.put("/customer/createContact/"+ customer['_id'], {
      token: user.data.token,
      contact: thisContact
    })

    if(res.data.status == true){
      setContacts(res.data.data.contact)
      setSuccessMsg(res.data.message)
      setError(false)
      setSuccess(true)
    }else{
      setErrorMsg(res.data.message)
      setSuccess(false)
      setError(true)
    }
  }

  const handleEditContactOpenDialog = (e) => {
    const thisContact = contacts.filter((con) => con['_id'] == e.target.dataset.id)
    setContactID(e.target.dataset.id)
    setEmail(thisContact[0]['email'])
    setTelephone(thisContact[0]['telephone'])
    setContactAddress(thisContact[0]['contactAddress'])
    setContactPerson(thisContact[0]['contactPerson'])
    setContactZipcode(thisContact[0]['contactZipcode'])
    const thisCustomer = customers.filter((cust) => cust['_id'] == customerId)
    setCustomer(thisCustomer[0])
    setEditContactDialog(true)
  }

  const handleEditCustomerContact = async() => {
    const arr2 = contacts.map((con)=>{
      if(con['_id'] == contactID){
          con['email'] = email
          con['telephone'] = telephone
          con['contactAddress'] = contactAddress
          con['contactPerson'] = contactPerson
          con['contactZipcode'] = contactZipcode
      }
      return con
    })

    setContacts(arr2)

    const res = await axiosInstance.put("/customer/editContact/" + customerId, {
      token: user.data.token,
      contact: arr2
    })


  } 

  const handleOpenDeleteContactDialog = async() =>{
    setShowDeleteContactDialog(true)
  }

  const handleCloseDeleteContactDialog = () =>{
    setShowDeleteContactDialog(false)
  }

  const handleDeleteContact = async() =>{
    const arr2 = contacts.filter((con)=> con['_id'] != contactID) 
    console.log(arr2)

    setContacts(arr2)

    const res = await axiosInstance.put("/customer/editContact/" + customerId, {
      token: user.data.token,
      contact: arr2
    })
    console.log(res.data)
    if(res.data.status == true){
      setShowDeleteContactDialog(false)
      setEditContactDialog(false)
      setContactID("")
    }
  }
  const handleBacktoCustomer = () =>{
    setEmail("")
    setTelephone("")
    setContactID("")
    setEditContactDialog(false)
    setCreateContactDialog(false)
  }

  const handleNewContact = () => {
    const thisCustomer = customers.filter((cust) => cust['_id'] == customerId)
    setCustomer(thisCustomer[0])
    setCreateContactDialog(true)
  }



  return (
    <section className={style.main_content}>
      <div className={style.container_fluid}>
        <div className={style.row}>
          <div className={style.optiondiv}>
            {/* <input type="text" name="filterName" value={filterName}/> */}
            <select
             name="fdsfd" 
             id="sdfsdf"
             onChange={(e) => handleSeleteOption(e)}
             className={style.optionen}
             placeholder="Optionen"
            >
              <option style={{fontSize: "16px", fontWeight: "600"}} disbled selected hidden>Optionen</option>
              <option style={{fontSize: "16px", fontWeight: "600"}} value="0">Create Customer</option>               
              <option style={{fontSize: "16px", fontWeight: "600"}} value="1">Create Contact</option>
            </select>
            
          </div>
          <div className={style.custom_col_outer}>
            <div className={style.table_responsive}>
              <table
                className={`${style.table} ${style.table_bordered} ${style.high_light}`}
              >
                <thead className={style.table_dark}>
                  <tr>
                    <th scope="col">CustomerName</th>
                    <th scope="col">CustomerNumber</th>
                    <th scope="col">StreetNumber</th>
                    <th scope="col">ZipCity</th>
                    <th scope="col">Country</th>
                    <th scope="col">LastModifiedBy</th>
                    <th scope="col">LastModifiedDate</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, ) => {
                    return (
                      <tr key={customer['_id']}>
                        <td style={{textTransform: "capitalize"}}>{customer.name}</td>
                        <td>{customer.customerNumber}</td>
                        <td>{customer.streetnumber}</td>
                        <td>{customer.zipcode}</td>
                        <td>{customer.country}</td>
                        <td style={{textTransform: "capitalize"}}>{customer.modifiedBy ? customer.modifiedBy.firstname : "N/A"}</td>
                        <td>{dateFormat(customer.date)}</td>
                        <td>
                          <button
                            type="button"
                            className={`${style.btn} ${style.edit_btn}`}
                            onClick={() => handleClickOpen(customer._id)}
                          >
                            <span>
                              <FontAwesomeIcon icon={faPen} />
                            </span>
                            EditCustomer
                          </button>
                        </td>
                        {/* <td>
                        <button
                            type="button"
                            className={`${style.btn} ${style.edit_btn}`}
                            onClick={() => handleOpenDeleteUser(customer._id)}
                          >
                            Delete
                          </button>
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        fullScreen
        open={openModal}
        onClose={handleModalClose}
        TransitionComponent={Transition}
        sx={{ marginTop: "110px", marginLeft: "1000px" }}
      >
        <AppBar sx={{ position: "relative", paddingRight: "0px !important" }}>
          <Toolbar sx={{ backgroundColor: "white", color: "black" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleModalClose}
              aria-label="close"
            >
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {/* Sound */}
            </Typography>
            <Button
              sx={{
                backgroundColor: "#000000",
                fontSize: "16px",
                color: "#fff",
                textTransform: "capitalize",
                fontWeight: "600",
                gap: "5px",
                padding: "8px 20px",
                borderRadius: "10px",
                marginRight: "5px",
                "&:hover": { backgroundColor: "#000000" },
              }}
              onClick={handleNewContact}
            >
              <FontAwesomeIcon icon={faSave} />
              New Contact
            </Button>
            <Button
              sx={{
                backgroundColor: "#ff0000",
                fontSize: "16px",
                color: "#fff",
                textTransform: "capitalize",
                fontWeight: "600",
                gap: "5px",
                padding: "8px 20px",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#09753a" },
                marginRight: "5px"
              }}
              onClick={handleOpenDeleteUser}
            >
              Delete
            </Button>
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
                "&:hover": { backgroundColor: "#09753a" },
              }}
              onClick={handleEdit}
            >
              <FontAwesomeIcon icon={faSave} />
              save
            </Button>
          </Toolbar>
        </AppBar>
        <div className={style.modelForm} style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                <div className={style.form} style={{width: "100%"}}>
                  <div className={style.formCol}>
                    <label>Name</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={name}
                      onChange={(e)=>setName(e.target.value)}
                      placeholder="Name"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Customer Number</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={customerNumber}
                      onChange={(e)=>setCustomerNumber(e.target.value)}
                      placeholder="Customer Number"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Street Number</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={streetNumber}
                      onChange={(e)=>setStreetNumber(e.target.value)}
                      placeholder="Street Number"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Zip Code / City</label>
                    <input
                      type="text"
                      className={style.formControl}
                      value={zipCode}
                      onChange={(e)=>setZipCode(e.target.value)}
                      placeholder="Zip Code"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Country</label>
                     <select 
                      className={style.formControl}
                      value={country}
                      onChange={(e)=>setCountry(e.target.value)}
                    >
                    {countries.map((cntry) => {
                      return (
                      <option value={cntry} selected={cntry == country ? true: false}>{cntry}</option>
                      )
                    }
                    )}
                    </select>
                  </div>
                </div>
                
                <div className={style.table_responsive} style={{width: "100%"}}>
                  {
                    contacts
                    ?
                    <table
                      className={`${style.table} ${style.table_bordered} ${style.high_light}`}
                    >
                      <thead className={style.table_dark}>
                        <tr>
                          <th scope="col">Kontaktperson</th>
                          <th scope="col">Adresse</th>
                          <th scope="col">PLZ / Ort</th>                          
                          <th scope="col">Email</th>
                          <th scope="col">Telephone</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((contact, index) => {
                          return (
                            <tr key={contact['_id']}>
                              <td style={{textTransform: "capitalize"}}>{name}</td>
                              <td>{contact.contactAddress}</td>
                              <td>{contact.contactZipcode}</td>
                              <td>{contact.email}</td>
                              <td>{contact.telephone}</td>
                              <td>
                              <button
                                type="button"
                                className={`${style.btn} ${style.edit_btn}`}
                                onClick={handleEditContactOpenDialog}
                                data-id={contact['_id']}
                              >
                                <span>
                                  <FontAwesomeIcon icon={faPen} />
                                </span>
                                EditContact
                              </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    :
                    <></>
}
                </div>
              </div>
      </Dialog>


      {/* craete a customer dialogue */}

      <Dialog
        fullScreen
        open={openModalCreateCustomer}
        onClose={handleModalCloseCreateCustomer}
        TransitionComponent={Transition}
        sx={{ marginTop: "110px", marginLeft: "1000px" }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar sx={{ backgroundColor: "white", color: "black" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleModalCloseCreateCustomer}
              aria-label="close"
            >
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {/* Sound */}
            </Typography>
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
                "&:hover": { backgroundColor: "#09753a" },
              }}
              onClick={handleCreateCustomer}
            >
              <FontAwesomeIcon icon={faSave} />
              Create
            </Button>
          </Toolbar>
        </AppBar>
        <div className={style.modelForm}>
                <div className={style.form}>
                  <div className={style.formCol}>
                    <label>Name</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={name}
                      onChange={(e)=>setName(e.target.value)}
                      placeholder="Name"
                      style={{textTransform: "capitalize"}}
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Customer Number</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={customerNumber}
                      onChange={(e)=>setCustomerNumber(e.target.value)}
                      placeholder="Customer Number"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Street Number</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={streetNumber}
                      onChange={(e)=>setStreetNumber(e.target.value)}
                      placeholder="Street Number"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Zip Code / City</label>
                    <input
                      type="text"
                      className={style.formControl}
                      value={zipCode}
                      onChange={(e)=>setZipCode(e.target.value)}
                      placeholder="Zip Code"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Country</label>
                     <select 
                      className={style.formControl}
                      value={country}
                      onChange={(e)=>setCountry(e.target.value)}
                    >
                    {countries.map((cntry) => {
                      return (
                      <option value={cntry} selected={cntry == country ? true: false}>{cntry}</option>
                      )
                    }
                    )}
                    </select>
                  </div>
                </div>
              </div>
      </Dialog>

      {/* create a customer dialogue */}

      <Dialog
        open={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Customer ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this customer ? 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteUser} autoFocus>
            Delete
          </Button>
        </DialogActions>
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

      {/* circular progress loader dialogue */}

      {/* select customer for contact dialog */}
      
      <Dialog
        open={selectCustomerDialog}
        // onClose={}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
        </DialogTitle>
        <DialogContent>
          <div>
          <div className={style.optiondiv2} >
            {/* <input type="text" name="filterName" value={filterName}/> */}
            <label for="sdfsdf">
              Choose a Customer
            </label> 
            <select
             name="fdsfd" 
             id="sdfsdf"
             onChange={(e) => handleSelectCustomer(e)}
             className={style.optionen2}
             placeholder="Optionen"
            value={customer['_id']}
            >
              <option value="">Select</option>
            {
              customers
              ?
              customers.map((cust) => {
                return(
                  <option value={cust['_id']}>{cust['name']}</option>
                )
              })
              :
              <></>
            }            
            </select>
            
          </div>
          <div className={style.customBtnDiv}>
            <button className={style.customBtn} onClick={handlecustomerConfirmation}>
              Weiter
            </button>
          </div>
          </div>
        </DialogContent>
      </Dialog> 

      {/* select customer for contact dialog end*/}
      
      {/* create Customer Contact dialog */}
      <Dialog
        fullScreen
        open={createContactDialog}
        onClose={handleCreateContactDialogClose}
        TransitionComponent={Transition}
        sx={{ marginTop: "110px", marginLeft: "1000px" }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar sx={{ backgroundColor: "white", color: "black" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCreateContactDialogClose}
              aria-label="close"
            >
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {/* Sound */}
            </Typography>
            <Button
              sx={{
                backgroundColor: "#000000",
                fontSize: "16px",
                color: "#fff",
                textTransform: "capitalize",
                fontWeight: "600",
                gap: "5px",
                padding: "8px 20px",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#000000" },
                marginRight: "5px"
              }}
              onClick={handleBacktoCustomer}
            >
              
<FontAwesomeIcon icon={faArrowLeft} style={{color: "#ffffff",}} />
              Back To Customer
            </Button>
            <Button
              sx={{
                backgroundColor: "#ff0000",
                fontSize: "16px",
                color: "#fff",
                textTransform: "capitalize",
                fontWeight: "600",
                gap: "5px",
                padding: "8px 20px",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#09753a" },
                marginRight: "5px"
              }}
              onClick={handleOpenDeleteUser}
            >
              Delete
            </Button>
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
                "&:hover": { backgroundColor: "#09753a" },
              }}
              onClick={handleSaveContactToCustomer}
            >
              <FontAwesomeIcon icon={faSave} />
              save
            </Button>
          </Toolbar>
        </AppBar>
        <div className={style.modelForm} style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                <div className={style.form} style={{width: "100%"}}>
                  <div className={style.formCol}>
                    <label>Kontaktperson</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={contactPerson}
                      onChange={(e)=>setContactPerson(e.target.value)}
                      placeholder="Kontaktperson"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Adresse</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={contactAddress}
                      onChange={(e)=>setContactAddress(e.target.value)}
                      placeholder="Adresse"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>PLZ / Ort</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={contactZipcode}
                      onChange={(e)=>setContactZipcode(e.target.value)}
                      placeholder="PLZ / ORT"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Telefon</label>
                    <input
                      type="text"
                      className={style.formControl}
                      value={telephone}
                      onChange={(e)=>setTelephone(e.target.value)}
                      placeholder="Telefon"
                    />
                  </div> 
                  <div className={style.formCol}>
                    <label>E-Mail</label>
                    <input
                      type="text"
                      className={style.formControl}
                      value={email}
                      onChange={(e)=>setEmail(e.target.value)}
                      placeholder="E-Mail"
                    />
                  </div>
                </div>
{/*                 
                <div className={style.table_responsive} style={{width: "100%"}}>
                  {
                    contacts
                    ?
                    <table
                      className={`${style.table} ${style.table_bordered} ${style.high_light}`}
                    >
                      <thead className={style.table_dark}>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Surname</th>
                          <th scope="col">Email</th>
                          <th scope="col">Telephone</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((contact, index) => {
                          return (
                            <tr key={contact['_id']}>
                              <td style={{textTransform: "capitalize"}}>{name}</td>
                              <td>{contact.customerNumber}</td>
                              <td>{contact.email}</td>
                              <td>{contact.telephone}</td>
                              <td>
                                <button>
                                  Edit
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    :
                    <></>
}
                </div> */}
              </div>
      </Dialog>
      {/* create Customer Contact dialog end*/}

      {/* create Edit Customer Contact dialog */}
      <Dialog
        fullScreen
        open={editContactDialog}
        onClose={handleEditContactDialogClose}
        TransitionComponent={Transition}
        sx={{ marginTop: "110px", marginLeft: "1000px" }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar sx={{ backgroundColor: "white", color: "black" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleEditContactDialogClose}
              aria-label="close"
            >
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {/* Sound */}
            </Typography>
            
            <Button
              sx={{
                backgroundColor: "#000000",
                fontSize: "16px",
                color: "#fff",
                textTransform: "capitalize",
                fontWeight: "600",
                gap: "5px",
                padding: "8px 20px",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#000000" },
                marginRight: "5px"
              }}
              onClick={handleBacktoCustomer}
            >
              
<FontAwesomeIcon icon={faArrowLeft} style={{color: "#ffffff",}} />
              Back To Customer
            </Button>
            <Button
              sx={{
                backgroundColor: "#ff0000",
                fontSize: "16px",
                color: "#fff",
                textTransform: "capitalize",
                fontWeight: "600",
                gap: "5px",
                padding: "8px 20px",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#09753a" },
                marginRight: "5px"
              }}
              onClick={handleOpenDeleteContactDialog}
            >
              Delete
            </Button>
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
                "&:hover": { backgroundColor: "#09753a" },
              }}
              onClick={handleEditCustomerContact}
            >
              <FontAwesomeIcon icon={faSave} />
              save
            </Button>
          </Toolbar>
        </AppBar>
        <div className={style.modelForm} style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                <div className={style.form} style={{width: "100%"}}>
                <div className={style.formCol}>
                    <label>Kontaktperson</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={contactPerson}
                      onChange={(e)=>setContactPerson(e.target.value)}
                      placeholder="Kontaktperson"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Adresse</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={contactAddress}
                      onChange={(e)=>setContactAddress(e.target.value)}
                      placeholder="Adresse"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>PLZ / Ort</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={contactZipcode}
                      onChange={(e)=>setContactZipcode(e.target.value)}
                      placeholder="PLZ / ORT"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Telefon</label>
                    <input
                      type="text"
                      className={style.formControl}
                      value={telephone}
                      onChange={(e)=>setTelephone(e.target.value)}
                      placeholder="Telefon"
                    />
                  </div> 
                  <div className={style.formCol}>
                    <label>E-Mail</label>
                    <input
                      type="text"
                      className={style.formControl}
                      value={email}
                      onChange={(e)=>setEmail(e.target.value)}
                      placeholder="E-Mail"
                    />
                  </div>
                </div>
              </div>
      </Dialog>
      {/* create Edit  Customer Contact dialog end*/}

       {/* create a customer dialogue */}

       <Dialog
        open={showDeleteContactDialog}
        onClose={handleCloseDeleteContactDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Contact ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this contact ? 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteContactDialog}>Cancel</Button>
          <Button onClick={handleDeleteContact} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>


      {success && (
        <Snackbar open={success} autoHideDuration={2000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMsg}
          </Alert>
        </Snackbar>
      )}
      {error && (
        <Snackbar open={error} autoHideDuration={2000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {errorMsg}
          </Alert>
        </Snackbar>
      )}
    </section>
  );
}
