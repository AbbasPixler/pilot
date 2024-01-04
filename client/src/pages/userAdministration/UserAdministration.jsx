import React, { useState, useEffect, useContext } from "react";
import style from "./userAdministration.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSave, faClose } from "@fortawesome/free-solid-svg-icons";
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

const modulesObject = {
  dashboard: Time,
  quotations: Quotations,
  "pricing table": Pricing,
  customer: Customer,
  "user administration": Administration,
  "material group": Administration,
  "templates": Administration,
  "languages": Administration
}


export default function UserAdministration() {
  const [openModal, setOpenModal] = useState(false);
  const [openModalCreateUser, setOpenModalCreateUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [languages, setLanguages] = useState([])
  const [userId, setUserId] = useState("");
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("") 
  const [password, setPassword] = useState("")
  const [active, setActive] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [approved, setApproved] = useState(false)
  const [language, setLanguage] = useState("")  
  const [company, setCompany] = useState("")  
  const [companies, setCompanies] = useState([])
  const [phone, setPhone] = useState("")
  const [checkboxItem, setCheckboxItem] = useState([])
  const { user } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPlaceOrderButton, setShowPlaceOrderButton] = useState(false)
  const { dispatch, isFetching } = useContext(Context);
  

  const fetchUser = async () => {
    setShowPlaceOrderButton(true)

    const res = await axiosInstance.post("auth/fetchAll", {
      token: user.data.token,
    });
    if(res.data.status == true){
      setUsers(res.data.data);
      setShowPlaceOrderButton(false);      
    }
  };

  const fetchCompanies = async () => {
    const res = await axiosInstance.post("companies/fetchAll", {
      token: user.data.token,
    });
    if(res.data.status == true){
      setCompanies(res.data.data);      
    }
  }
  const fetchLanguages = async () => {
    const res = await axiosInstance.post("languages/fetchAll", {
      token: user.data.token,
    });
    if(res.data.status == true){
      setLanguages(res.data.data);      
    }
  }

  useEffect(() => {
    fetchUser();
    fetchCompanies();
    fetchLanguages();
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
    setOpenModal(true);
    setUserId(id);
    const res = await axiosInstance.post(`auth/fetch/${id}`, {token : user.data.token})
    setFirstname(res.data.data.firstname)
    setLastname(res.data.data.lastname)
    setPassword(res.data.data.password)
    setEmail(res.data.data.email)
    setActive(res.data.data.active)
    setApproved(res.data.data.approved)
    setRegistered(res.data.data.verified)
    setLanguage(res.data.data.language ? res.data.data.language['_id'] : "")
    setCheckboxItem(res.data.data.modules)
    setCompany(res.data.data.company)
    setPhone(res.data.data.phone)
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
    const updateUser = {
      user: {
        firstname: firstname,
        lastname: lastname,
        password: password,
        active:active,
        verified: registered,
        modules:checkboxItem,
        language: language,
        company: company,        
        phone: phone
      },
      token: user.data.token
    };

    if (
      firstname === "" ||
      lastname === "" ||
      password === ""||
      language === ""
    ) {
      setOpen(true);
      setError(true);
      setErrorMsg("Cannot leave Firstname, Lastname, password or language empty!");
    } else {
      // setIsLoading(true);
      
    setShowPlaceOrderButton(true)
      const res = await axiosInstance.put(`/auth/update/${userId}`, updateUser);

      if (res.data.status === true) {

        if(userId === user.data._id){          
          dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
        }

        fetchUser();
        setOpen(true);
        setSuccess(true);
        setSuccessMsg(res.data.message);

        setOpenModal(false)
        setFirstname("")
        setLastname("")
        setPassword("")
        setEmail("")
        setActive(false)
        setRegistered(false)
        setLanguage("")
        setCheckboxItem([])
        setCompany("")
        setPhone("")
        setTimeout(() => {
          setShowPlaceOrderButton(false)
        }, 1000)
      } else {
        // setIsLoading(false);
        setOpen(true);
        setError(true);
        setErrorMsg(res.data.message);
        setTimeout(() => {
          setShowPlaceOrderButton(false)
        }, 1000)
      }
    }
   
  }

  const handleOpenDeleteUser = () => {
    if(user.data._id == userId){
      setSuccess(false)
      setError(true)
      setErrorMsg("Cannot Delete Yourself")
    }else{
      setShowDeleteDialog(true)
    }
  }
  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false)
    setUserId("")
  }
  const handleDeleteUser = async () => {
    const res = await axiosInstance.post("/auth/delete/" + userId, {
      token: user.data.token
    })

    if(res.data.status == true){      
      setError(false)
      setSuccess(true)
      setSuccessMsg(res.data.message)
      setUserId("")
      setShowDeleteDialog(false)
      setOpenModal(false)
      fetchUser()
    }else{
      setSuccess(false)
      setError(true)
      setErrorMsg(res.data.message)
    }


  }


  const handleModalClose = () => {
    setFirstname("")
    setLastname("")
    setPassword("")
    setEmail("")
    setActive(false)
    setRegistered(false)
    setLanguage("")
    setCheckboxItem([])
    setCompany("")
    setPhone("")
    setOpenModal(false);
  };

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
      setOpenModalCreateUser(true)
    }else if(e.target.value == 1){

    }
  }

  const handleModalCreateUserClose =() =>{
    setOpenModalCreateUser(false)
  }

  const handleCreateCustomer = async(e) => {
    setShowPlaceOrderButton(true)
    e.preventDefault();
    const updateUser = {
      user: {
        firstname: firstname,
        lastname: lastname,
        active: true,
        email: email,
        modules:checkboxItem,
        language: language,
        company: company,        
        phone: phone
      },
      token: user.data.token
    };

    if (
      firstname === "" ||
      lastname === "" ||
      email === "" || 
      language === "" ||
      company === ""

      ) {
      setOpen(true);
      setError(true);
      setErrorMsg("Please fill this input!");
    } else {
      // setIsLoading(true);
      const res = await axiosInstance.put('/auth/create', updateUser);
      if (res.data.status === true) {

        fetchUser();
        setOpen(true);
        setSuccess(true);
        setSuccessMsg(res.data.message);

        setOpenModal(false)
        setTimeout(() => {
          setShowPlaceOrderButton(false)
        }, 1000)
      } else {
        // setIsLoading(false);
        setOpen(true);
        setError(true);
        setErrorMsg(res.data.message);
        setTimeout(() => {
          setShowPlaceOrderButton(false)
        }, 1000)
      }
    }
  }

  const handleApproveUser = async(e, v) => {
    setApproved(v)
    setActive(v)
    const statusApproved = v
    const res = await axiosInstance.put(`/auth/approveUser/${userId}`, {token: user.data.token, user: {
      approved: statusApproved,
      active: statusApproved
    }})
    if(res.data.status == true){
      setError(false)
      setSuccessMsg(res.data.message)
      setSuccess(true)
    }else{
      setSuccess(false)
      setErrorMsg(res.data.message)
      setError(true)
    }
  }
  return (
    <section className={style.main_content}>
      <div className={style.container_fluid}>
        <div className={style.row}>
        <div className={style.optiondiv}>
            <select
             name="fdsfd" 
             id="sdfsdf"
             onChange={(e) => handleSeleteOption(e)}
             className={style.optionen}
             placeholder="Optionen"
            >
              <option style={{fontSize: "16px", fontWeight: "600"}} disbled selected hidden>Optionen</option>
              <option style={{fontSize: "16px", fontWeight: "600"}} value="0">Add New User</option>
            </select>
          </div>
          <div className={style.custom_col_outer}>
            <div className={style.table_responsive}>
              <table
                className={`${style.table} ${style.table_bordered} ${style.high_light}`}
              >
                <thead className={style.table_dark}>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Surname</th>
                    <th scope="col">Email</th>
                    <th scope="col">Access</th>
                    <th scope="col">Status</th>
                    <th scope="col">LastModifiedBy</th>
                    <th scope="col">LastModifiedDate</th>
                    <th scope="col">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => {
                    return (
                      <tr key={i}>
                        <td>{user.firstname}</td>
                        <td>{user.lastname}</td>
                        <td>{user.email}</td>
                        <td>
                          <div style={{ display: "flex" }}>
                            {user.modules.includes("dashboard") && (<img
                              src={Time}
                              style={{
                                padding: "5px",
                                height: "30px",
                                width: "30px",
                              }}
                              alt="time"
                            />)
                            }
                            {user.modules.includes("quotations") && (<img
                              src={Quotations}
                              style={{
                                padding: "5px",
                                height: "30px",
                                width: "30px",
                              }}
                              alt="quotation"
                            />)
}
                            {user.modules.includes("pricing table") && (<img
                              src={Pricing}
                              style={{
                                padding: "5px",
                                height: "30px",
                                width: "30px",
                              }}
                              alt="pricing table"
                            />)
                            }
                            {user.modules.includes("customer") && (<img
                              src={Customer}
                              style={{
                                padding: "5px",
                                height: "30px",
                                width: "30px",
                              }}
                              alt="customer"
                            />)
                            }
                            {user.modules.includes("user administration") && (<img
                              src={Administration}
                              style={{
                                padding: "5px",
                                height: "30px",
                                width: "30px",
                              }}
                              alt="user administration"
                            />)
                            }
                            
                          </div>
                        </td>
                        <td>
                          {user.active === true ? 
                            <span className={style.userStatusActive}>
                              Active
                            </span>
                           :
                           user.verified == true && user.active == false
                           ?
                            <span className={style.userStatusRegistered}>
                              Registered
                            </span>
                          :
                            <span className={style.userStatusInactive}>
                              Inactive
                            </span>


                          }
                        </td>
                        <td style={{textTransform: "capitalize"}}>{user.modifiedBy ? user.modifiedBy : "N/A"}</td>
                        <td>{dateFormat(user.date)}</td>
                        <td>
                          <button
                            type="button"
                            className={`${style.btn} ${style.edit_btn}`}
                            onClick={() => handleClickOpen(user._id)}
                          >
                            <span>
                              <FontAwesomeIcon icon={faPen} />
                            </span>
                            Edit
                          </button>
                        </td>
                        {/* <td>
                        <button
                            type="button"
                            className={`${style.btn} ${style.edit_btn}`}
                            onClick={() => handleOpenDeleteUser(user._id)}
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
        <AppBar sx={{ position: "relative" }}>
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
            {approved == true
            ?
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
                "&:hover": { backgroundColor: "#00A2E9", opacity: 0.8 },
                marginRight: "5px"
              }}
              onClick={(e) => handleApproveUser(e, false)}
            >
              DisApprove
            </Button>
            :
            <Button
              sx={{
                backgroundColor: "#00A2E8",
                fontSize: "16px",
                color: "#fff",
                textTransform: "capitalize",
                fontWeight: "600",
                gap: "5px",
                padding: "8px 20px",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#ff0000", opacity: 0.8 },
                marginRight: "5px"
              }}
              onClick={(e) => handleApproveUser(e, true)}
            >
              Approve
            </Button>
            }
            
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
        <div className={style.modelForm}>
                <div className={style.form}>
                  <div className={style.formCol}>
                    <label>Name</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={firstname}
                      onChange={(e)=>setFirstname(e.target.value)}
                      placeholder="Name"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Surname</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={lastname}
                      onChange={(e)=>setLastname(e.target.value)}
                      placeholder="Surname"
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
                      disabled
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Languages</label>
                    <select 
                      className={style.formControl}
                      value={language}
                      onChange={(e)=>setLanguage(e.target.value)}
                    >
                      <option style={{fontSize: "16px", fontWeight: "600"}} disbled selected hidden>Language</option>
                      {languages && languages.length > 0
                      ?
                      languages.map((lang) => {
                        return(
                          <option value={lang._id} selected = {language == lang._id ? true: false}>{lang.language}</option>
                        )
                      })
                      :
                      <></>
                      }
                    </select>
                  </div>
                  <div className={style.formCol}>
                    <label>Phone</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={phone}
                      onChange={(e)=>setPhone(e.target.value)}
                      placeholder="Phone"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Company</label>
                    <select 
                      className={style.formControl}
                      value={company}
                      onChange={(e)=>setCompany(e.target.value)}
                    >
                       <option disbled selected hidden>Select a Company</option>
                      {companies ? 
                      companies.map((comp) => { 
                        return(
                          <option value={comp['_id']} selected = {company == comp['_id'] ? true: false}>{comp['name']}</option>
                        )
                      })
                    :
                    <></>}
                    </select>
                  </div>
                  <div className={style.formCol}>
                    <label>Status</label>
                    <select 
                      className={style.formControl}
                      value={active}
                      onChange={(e)=>setActive(e.target.value)}
                    >
                      <option style={{fontSize: "16px", fontWeight: "600"}} disbled selected hidden>Status</option>
                      <option value="true" selected = {active == true ? true: false}>Active</option>
                      <option value="false" selected = {active == false ? true: false}>Inactive</option>
                    </select>
                  </div>
                  <div className={style.formCol}>
                    <label>Approved</label>
                    <select 
                      className={style.formControl}
                      value={approved}
                      onChange={(e)=>setApproved(e.target.value)}
                    >
                      <option value="true" selected = {approved == true ? true: false}>True</option>
                      <option value="false" selected = {approved == false ? true: false}>False</option>
                    </select>
                  </div>
                  {/* <div className={style.formCol}>
                    <label>New Password</label>
                    <input
                      type="password"
                      className={style.formControl}
                      value={password}
                      onChange={(e)=>setPassword(e.target.value)}
                      placeholder="Password"
                    />
                  </div> */}
                </div>
                <div>
                  {modulesObject ? Object.keys(modulesObject).map((module)=> {
                    return (
                      <div className={style.custom}>
                      <input type="checkbox" value="dashboard" id={module} checked={ checkboxItem.includes(module) ? true:false } onChange={(e) => handleCheckboxChange(e, module)} />
                      <label htmlFor={module}>
                        <span>
                          <img src={modulesObject[module]} alt="dashboard" />
                        </span>
                        {module}
                      </label>
                  </div>
                    )
                  })
                  :
                  <></>}
                  {/* <div className={style.custom}>
                    <input type="checkbox" value="dashboard" id="dashboard" checked={ checkboxItem.includes("dashboard") ? true:false } onChange={handleCheckboxChange} />
                    <label htmlFor="dashboard">
                      <span>
                        <img src={Time} alt="dashboard" />
                      </span>
                      Dashboard
                    </label>
                  </div>
                  <div className={style.custom}>
                    <input type="checkbox" value="quotation" checked={ checkboxItem.includes("quotation") ? true:false } onChange={handleCheckboxChange} />
                    <label>
                      <span>
                        <img src={Quotations} alt="quotation" />
                      </span>
                      Quotations
                    </label>
                  </div>
                  <div className={style.custom}>
                    <input type="checkbox" value="price" checked={ checkboxItem.includes("price") ? true:false } onChange={handleCheckboxChange} />
                    <label>
                      <span>
                        <img src={Pricing} alt="price" />
                      </span>
                      Pricing Table
                    </label>
                  </div>
                  <div className={style.custom}>
                    <input type="checkbox" value="customer" checked={ checkboxItem.includes("customer") ? true:false } onChange={handleCheckboxChange} />
                    <label>
                      <span>
                        <img src={Customer} alt="customer" />
                      </span>
                      Customer
                    </label>
                  </div>
                  <div className={style.custom}>
                    <input type="checkbox" value="administration" checked={ checkboxItem.includes("administration") ? true:false } onChange={handleCheckboxChange} />
                    <label>
                      <span>
                        <img src={Administration} alt="administration" />
                      </span>
                      UserAdministration
                    </label>
                  </div> */}
                </div>
              </div>
      </Dialog>
      <Dialog
        fullScreen
        open={openModalCreateUser}
        onClose={handleModalCreateUserClose}
        TransitionComponent={Transition}
        sx={{ marginTop: "110px", marginLeft: "1000px" }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar sx={{ backgroundColor: "white", color: "black" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleModalCreateUserClose}
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
              disabled
            >
              <FontAwesomeIcon icon={faSave} />
              create
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
                      value={firstname}
                      onChange={(e)=>setFirstname(e.target.value)}
                      placeholder="Name"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Surname</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={lastname}
                      onChange={(e)=>setLastname(e.target.value)}
                      placeholder="Surname"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>E-Mail</label>
                    <input
                      type="email"
                      className={style.formControl}
                      value={email}
                      onChange={(e)=>setEmail(e.target.value)}
                      placeholder="E-Mail"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Languages</label>
                    <select 
                      className={style.formControl}
                      value={language}
                      onChange={(e)=>setLanguage(e.target.value)}
                    >
                      <option style={{fontSize: "16px", fontWeight: "600"}} disbled selected hidden>Language</option>
                      {languages && languages.length > 0
                      ?
                      languages.map((lang) => {
                        return(
                          <option value={lang._id} selected = {language == lang._id? true: false}>{lang.language}</option>)
                      })
                      :
                      <></>
                      }
                      {/* // <option value="english" selected = {language == "english" ? true: false}>English</option>
                      // <option value="german" selected = {language == "german" ? true: false}>German</option> */}
                    </select>
                  </div>
                  <div className={style.formCol}>
                    <label>Phone</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={phone}
                      onChange={(e)=>setPhone(e.target.value)}
                      placeholder="Phone"
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Company</label>
                    <select 
                      className={style.formControl}
                      value={company}
                      onChange={(e)=>setCompany(e.target.value)}
                    >
                       <option disbled selected hidden>Select a Company</option>
                      {companies ? 
                      companies.map((comp) => { 
                        return(
                          <option value={comp['_id']} selected = {company == comp['_id'] ? true: false}>{comp['name']}</option>
                        )
                      })
                    :
                    <></>}
                    </select>
                  </div>
                  {/* <div className={style.formCol}>
                    <label>Status</label>
                    <select 
                      className={style.formControl}
                      value={active}
                      onChange={(e)=>setActive(e.target.value)}
                    >
                       <option style={{fontSize: "16px", fontWeight: "600"}} disbled selected hidden>Status</option>
                      <option value="true" selected = {active == true ? true: false}>Active</option>
                      <option value="false" selected = {active == false ? true: false}>Inactive</option>
                    </select>
                  </div> */}
                  {/* <div className={style.formCol}>
                    <label>Registered</label>
                    <select 
                      className={style.formControl}
                      value={registered}
                      onChange={(e)=>setRegistered(e.target.value)}
                    >
                      <option value="true" selected = {registered == true ? true: false}>Registered</option>
                      <option value="false" selected = {registered == false ? true: false}>Not Registered</option>
                    </select>
                  </div> */}
                </div>
                <div>
                  {modulesObject ? Object.keys(modulesObject).map((module)=> {
                    return (
                      <div className={style.custom}>
                      <input type="checkbox" value="dashboard" id={module} checked={ checkboxItem.includes(module) ? true:false } onChange={(e) => handleCheckboxChange(e, module)} />
                      <label htmlFor={module}>
                        <span>
                          <img src={modulesObject[module]} alt="dashboard" />
                        </span>
                        {module}
                      </label>
                  </div>
                    )
                  })
                  :
                  <></>}
                </div>
              </div>
      </Dialog>
      <Dialog
        open={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete User ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user ? 
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


      {/* circular progreaa loader dialogue */}
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
