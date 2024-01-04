import React, { useState, useEffect, useContext  } from "react";
import style from "./templates.module.css"
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

export default function Templates() {

  const { user } = useContext(Context);
  const [templates, setTemplates] = useState([])
  const [checkboxItem, setCheckboxItem] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPlaceOrderButton, setShowPlaceOrderButton] = useState(false)
  const [openAddTemplateDialogue, setOpenAddTemplateDialog] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [templateString, setTemplateString] = useState("")
  const [showTemplates, setShowTemplates] = useState(false)

  useEffect(() => { 
    fetchTemplates()
  }, [])

  const handleAllTemplates = (e) => {
      if (e.target.checked) {
        for(let x of templates){
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

  const handleDeleteTemplates = async() => {
    const res = await axiosInstance.post("/templates/deleteMany", {token: user.data.token, templates: checkboxItem})
        if(res.data.status == true){
          setError(false)
          setSuccessMsg(res.data.message)
          setSuccess(true)
          setCheckboxItem([])
          setShowDeleteDialog(false)
          fetchTemplates()
        }else{
          setSuccess(false)
          setSuccessMsg(res.data.message)
          setError(true)
        }
  }

  // =====function by abbas new===============

  const handleOpenAddTemplateDialog = (e) => {
    setOpenAddTemplateDialog(true)
  }

  
  const handleCloseAddTemplateDialog = () => {
    setOpenAddTemplateDialog(false)
  }

  const handleCreateTemplate = async() => {
    if(templateName.length < 1 || templateString.length < 1){
      setSuccess(false)
      setErrorMsg("Please fill all necessary Details!")
      setError(true)
    }else{
      const template = {
        name: templateName,
        templateString: templateString
      }

      const res = await axiosInstance.post("/templates/create", {
        token: user.data.token,
        template: template
      })
      if(res.data.status == true){
        fetchTemplates()
        setOpenAddTemplateDialog(false)
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
  
  const fetchTemplates = async() => {
    setShowPlaceOrderButton(true)
    const res = await axiosInstance.post("/templates/fetchAll", {
      token: user.data.token
    })
    if(res.data.status == true){

      const newMappedArray = res.data.data.map((temp) => {
        return {
          templateString: temp.templateString.replace(/&lt;/g, "<"),
          name: temp['name']
        }
      })

    setShowPlaceOrderButton(false)
      setTemplates(newMappedArray)
      setShowTemplates(true)
    }else{
    setShowPlaceOrderButton(false)
      setTemplates([])
    }
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
              onClick={handleOpenAddTemplateDialog}
              // disabled={showSaveButton ? false : true}
            >
              <FontAwesomeIcon icon={faSave} />
              Add Template
            </Button>
          </div>
          <div className={style.custom_col_outer}>
            <div className={style.table_responsive}>
              <table className={`${style.table} ${style.table_bordered}`}>
                <thead className={style.table_dark}>
                  <tr> 
                    <th style={{textAlign:"center"}}>
                    <input
                              type="checkbox"
                              onChange={handleAllTemplates}
                            />
                    </th>
                    <th scope="col">Template Name</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    showTemplates
                    ?
                    templates.map((temp) => {
                      return(
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            // value={arr._id}
                            // onChange={handleId}
                            // checked={checkboxItem.includes(arr['_id']) ? true : false}
                          />
                        </th>
                        <td className="td">{temp['name']}</td>
                        <td className="td"><span className={style.uploaded}>Uploaded</span></td>
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

      
      
    {/* Add langua dialog */}

    <Dialog
        fullScreen
        open={openAddTemplateDialogue}
        onClose={handleCloseAddTemplateDialog}
        TransitionComponent={Transition}
        sx={{ marginTop: "110px", marginLeft: "1000px" }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar sx={{ backgroundColor: "white", color: "black" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseAddTemplateDialog}
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
              onClick={handleCreateTemplate}
            >
              <FontAwesomeIcon icon={faSave} />
              Create
            </Button>
          </Toolbar>
        </AppBar>
        <div className={style.modelForm}>
                <div className={style.form}>
                  <div className={style.formCol}>
                    <label>Template</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={templateName}
                      onChange={(e)=>setTemplateName(e.target.value)}
                      placeholder="Template 1"
                      style={{textTransform: "capitalize"}}
                    />
                  </div>
                  <div className={style.formCol}>
                    <label>Template String</label>
                    <input
                      className={style.formControl}
                      type="text"
                      value={templateString}
                      onChange={(e)=>setTemplateString(e.target.value)}
                      placeholder="<Template>"
                    />
                  </div>
               
                </div>
              </div>
      </Dialog>
      {/* Add Language Dialog */}

            {/* circular progress loader dialogue */}

            {/* delete pricings dialoge */}
            <Dialog
              open={showDeleteDialog}
              onClose={handleCloseDeleteDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Delete Templates Groups?
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete the Templates ? 
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                <Button 
                onClick={handleDeleteTemplates} 
                autoFocus>
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
