import React, { useState, useEffect, useContext  } from "react";
import style from "./languages.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSave, faClose } from "@fortawesome/free-solid-svg-icons";
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

export default function Languages() {

  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const [languages, setLanguages] = useState([])
  const [translationObject, setTranslationObject] = useState({})
  const [showUploadCSVForm, setShowUploadCSVForm] = useState(false);
  const [showNewArrayData, setShowNewArrayData] = useState(false)
  const { user } = useContext(Context);
  const [materialGroups, setMaterialGroups] = useState([])
  const [showSaveButton, setShowSaveButton] = useState(false)
  const [checkboxItem, setCheckboxItem] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPlaceOrderButton, setShowPlaceOrderButton] = useState(false)
  const [openAddLanguageDialogue, setOpenAddLanguageDialog] = useState(false)
  const [languageName, setLanguageName] = useState("")
  const [languageAbbreviation, setLanguageAbbreviation] = useState("")

  useEffect(() => { 
    // fetchMaterialGroups()
    fetchLanguages()
  }, [])

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = string => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(";");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map(i => {
      if(i.length > 0){
      const values = i.split(";");
        const obj = csvHeader.reduce((object, header, index) => {

          const newHeader = header.toLowerCase()
          const header1 = newHeader.trimEnd()   
          object[header1] = values[index];
          return object;
        }, {});
        return obj;
      }
 
    
    });
    setShowNewArrayData(true)
    setArray(array);
    setShowUploadCSVForm(false)
    setShowSaveButton(true)
  };


  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };
      fileReader.readAsText(file);
    }
  };

  const handleSeleteOption = async(e) => {
    if(e.target.value == 0){
      setShowUploadCSVForm(true)

    }else if(e.target.value == 1){
      if(checkboxItem.length > 0){
        setShowDeleteDialog(true)
      }
    }
  }

  const handleCloseCSVFormDialog = () => {
    setShowUploadCSVForm(false)
  }

  const handleSavetranslations = async() => {

    const res = await axiosInstance.post("/languages/createTranslations", {
      translation: array,
      token: user.data.token
    })

    if(res.data.status == true){
    }
  
    setShowPlaceOrderButton(false)
    setShowUploadCSVForm(false)
    setShowNewArrayData(false)
    setArray([])
  }

  const handleAllPricings = (e) => {
      if (e.target.checked) {
        for(let x of materialGroups){
          if(!checkboxItem.includes(x['_id'])){
            checkboxItem.push(x['_id'])
            setCheckboxItem([...checkboxItem]);
          }
        }
      } else {
        setCheckboxItem([])
      }
  } 
  const handleId = async (e) => {
    if (e.target.checked) {
      setCheckboxItem([...checkboxItem, e.target.value]);
    } else {
      const updatedSelectedItem = checkboxItem.filter(
        (selectedItem) => selectedItem !== e.target.value
      );
      setCheckboxItem(updatedSelectedItem);
    }

  };

  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    // setOpen(false);

    setError(false);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false)
  }

  const handleOpenAddLanguageDialog = (e) => {
    setOpenAddLanguageDialog(true)
  }

  const handleCloseAddLanguageDialog = () => {
    setOpenAddLanguageDialog(false)
  }

  const handleCreateLanguage = async() => {
    if(languageName.length < 1 || languageAbbreviation.length < 1){

    }else{
      const lang = {
        language: languageName,
        initials: languageAbbreviation
      }

      const res = await axiosInstance.post("/languages/create", {
        token: user.data.token,
        language: lang
      })
      if(res.data.status == true){
        fetchLanguages()
        setOpenAddLanguageDialog(false)
        setError(false)
        setSuccessMsg(res.data.message)
        setSuccess(true)
      }else{
        setSuccess(false)
        setErrorMsg(res.data.message)
        setError(true)
      }
    }
 
  }

  const handleDeletePricings = async() => {
    const res = await axiosInstance.post("/materialGroup/deleteMany", {token: user.data.token, materialGroups: checkboxItem})
        if(res.data.status == true){
          setError(false)
          setSuccessMsg(res.data.message)
          setSuccess(true)
          setCheckboxItem([])
          setShowDeleteDialog(false)
        }else{
          setSuccess(false)
          setSuccessMsg(res.data.message)
          setError(true)
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

  

  const headerKeys = Object.keys(Object.assign({}, ...array));
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
              onClick={handleOpenAddLanguageDialog}
              // disabled={showSaveButton ? false : true}
            >
              <FontAwesomeIcon icon={faSave} />
              Add Language
            </Button>
            <Button
              sx={{
                backgroundColor: "#00B050",
                marginLeft: "5px",
                fontSize: "16px",
                color: "#fff",
                textTransform: "capitalize",
                fontWeight: "600",
                gap: "5px",
                padding: "8px 20px",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#09753a" },
              }}
              onClick={handleSavetranslations}
              disabled={showSaveButton ? false : true}
            >
              <FontAwesomeIcon icon={faSave} />
              Save
            </Button>
            <select
             name="fdsfd" 
             id="sdfsdf"
             onChange={(e) => handleSeleteOption(e)}
             className={style.optionen}
             placeholder="Optionen"
            >
              <option style={{fontSize: "16px", fontWeight: "600"}} disbled selected hidden>Optionen</option>
              <option style={{fontSize: "16px", fontWeight: "600"}} value="0">Upload CSV File</option>
              {checkboxItem.length > 0
              ?
              <option style={{fontSize: "16px", fontWeight: "600"}} value="1">Delete Material Groups</option>
              :
              <></>
              }
            </select>
          </div>
          <div className={style.custom_col_outer}>
            <div className={style.table_responsive}>
              <table className={`${style.table} ${style.table_bordered}`}>
                <thead className={style.table_dark}>
                  <tr> 
                    <th scope="col">#</th>
                    <th scope="col">Language</th>
                    <th scope="col">Code</th>
                    <th scope="col">Translations</th>
                  </tr>
                </thead>
                <tbody>
                  
                {languages.length > 0
                  ?
                  languages.map((arr, index) => { 
                    if(arr){
                      
                      return(
                        <tr>
                          <td>{index + 1}</td>
                          <td className="td">{arr.language}</td>
                          <td className="td">{arr.initials}</td>
                          <td className="td">N/A</td>
                        </tr>
                      )
                    }
                    
                  })
                :
                <></>}

                  {showNewArrayData && array.length > 0
                  ?
                  array.map((arr) => { 
                    if(arr){
                      return(
                        <tr>
                          <td className="td">{arr.material}</td>
                          <td className="td">{arr['material group']}</td>
                          <td className="td"><span className={style.notSavedNow}>notSavedNow</span></td>
                        </tr>
                      )
                    }
                    
                  })
                :
                <></>}
                 
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add langua dialog */}

      <Dialog
        fullScreen
        open={openAddLanguageDialogue}
        onClose={handleCloseAddLanguageDialog}
        TransitionComponent={Transition}
        sx={{ marginTop: "110px", marginLeft: "1000px" }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar sx={{ backgroundColor: "white", color: "black" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseAddLanguageDialog}
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
              onClick={handleCreateLanguage}
            >
              <FontAwesomeIcon icon={faSave} />
              Create
            </Button>
          </Toolbar>
        </AppBar>
        <div className={style.modelForm}>
                <div className={style.form}>
                  <div className={style.formCol}>
                    <label>Language</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={languageName}
                      onChange={(e)=>setLanguageName(e.target.value)}
                      placeholder="English"
                      style={{textTransform: "capitalize"}}
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Abbreviation</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={languageAbbreviation}
                      onChange={(e)=>setLanguageAbbreviation(e.target.value)}
                      placeholder="EN"
                    />
                  </div>
               
                </div>
              </div>
      </Dialog>
      {/* Add Language Dialog */}

      
      {/* create a customer dialogue */}
      <Dialog
        open={showUploadCSVForm}
        onClose={handleCloseCSVFormDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
         UploadNewTranslationList
        </DialogTitle>
        <DialogContent>
        <form>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />

        <button
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          IMPORT CSV
        </button>
      </form>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteUser} autoFocus>
            Delete
          </Button> */}
        </DialogActions>
      </Dialog>

            {/* circular progress loader dialogue */}

            {/* delete pricings dialoge */}
            <Dialog
              open={showDeleteDialog}
              onClose={handleCloseDeleteDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Delete Material Groups?
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete the Material Groups ? 
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                <Button onClick={handleDeletePricings} autoFocus>
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
    </section>
  );
}
