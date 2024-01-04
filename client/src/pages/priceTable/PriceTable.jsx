import React, { useState, useEffect, useContext  } from "react";
import style from "./priceTable.module.css";
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function PriceTable() {

  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const [showUploadCSVForm, setShowUploadCSVForm] = useState(false);
  const [showNewArrayData, setShowNewArrayData] = useState(false)
  const { user } = useContext(Context);
  const [pricings, setPricings] = useState([])
  const [showSaveButton, setShowSaveButton] = useState(false)
  const [checkboxItem, setCheckboxItem] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPlaceOrderButton, setShowPlaceOrderButton] = useState(false)
  const [showPricingsUploadCountDialogue, setShowPricingsUploadCountDialogue] = useState(false)
  const [pricingsCount, setPricingsCount] = useState(0)

  useEffect(() => { 
    fetchPricings()
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

  const handleSavePricing = async() => {
    setShowPricingsUploadCountDialogue(true)
    let i = 1
    for(let x of array){
      if(x){
        if(!x['material'].length > 0 || !x['service group'].length > 0 || !x['company code'].length > 0 || !x['service'].length > 0 || !x['price'].length > 0 || !x['working time'].length > 0 || !x['price version'].length > 0){
        continue;
      }

      i = i + 1;
      setPricingsCount(i)
      
      const pricing = {
        material: x['material'],
        serviceGroup: x['service group'],
        service: x['service'],
        company_id: x['company code'],
        price: x['price'],
        workingTime: x['working time'],
        priceVersion: x['price version']
      }
      const res = await axiosInstance.post("/pricing/create", {
        pricing: pricing,
        token: user.data.token
      })
      if(res.data.status == true){
        setShowSaveButton(false)
      }else{
        console.log(res.data)
        console.log(x)
      }
    }
    if(i == array.length){
      setShowPricingsUploadCountDialogue(false)
    }

    }
    fetchPricings()
    setShowUploadCSVForm(false)
    setShowNewArrayData(false)
    setArray([])
  }

  const handleAllPricings = (e) => {
      if (e.target.checked) {
        for(let x of pricings){
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

  const handleDeletePricings = async() => {
    setShowPlaceOrderButton(true)
    const res = await axiosInstance.post("/pricing/deleteMany", {token: user.data.token, pricings: checkboxItem})
    console.log(res.data)
        if(res.data.status == true){
          setShowPlaceOrderButton(false)
          setError(false)
          setSuccessMsg(res.data.message)
          setSuccess(true)
          setCheckboxItem([])
          setShowDeleteDialog(false)
          setPricings(res.data.data)
        }else{
          
          setShowPlaceOrderButton(false)
          setSuccess(false)
          setSuccessMsg(res.data.message)
          setError(true)
        }
  }

  console.log(array.length)
  
  const fetchPricings = async() => {
    setShowPlaceOrderButton(true)
    const res = await axiosInstance.post("/pricing/fetchAll", {
      token: user.data.token
    })
    if(res.data.status == true){
      setShowPlaceOrderButton(false)
      setPricings(res.data.data)
    }else{
      setShowPlaceOrderButton(false)
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
              onClick={handleSavePricing}
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
              <option style={{fontSize: "16px", fontWeight: "600"}} value="1">Delete Pricings</option>
              :
              <></>
              }
            </select>
          </div>
          <div className={style.custom_col_outer}>
            <div className={style.table_responsive}>
              <table className={`${style.table} ${style.table_bordered}`}>
                <thead className={style.table_dark} >
                  <tr> 
                    <th>
                    <input
                              type="checkbox"
                              // value={}
                              onChange={handleAllPricings}
                            />
                    </th>
                    <th scope="col">Material</th>
                    <th scope="col">Service Group</th>
                    <th scope="col">Material Group</th>
                    <th scope="col">Service</th>
                    <th scope="col">Company ID</th>
                    <th scope="col">Price Version</th>
                    <th scope="col" style={{textAlign: "right"}}>Price</th>
                    <th scope="col" style={{textAlign: "right"}}>Working Time</th>
                    <th scope="col">Status</th>
                    <th scope="col">CreatedBy</th>
                    <th scope="col">CreatedDate</th>
                  </tr>
                </thead>
                <tbody>
                  
                {pricings.length > 0
                  ?
                  pricings.map((arr) => { 
                    if(arr){
                      const index = arr['price'].indexOf(",")
                      let newPriceArray = []
                        let just = []
                        if(index != -1){
                            just = arr['price'].split(",")
                            newPriceArray = just[0].split("")
                        }else{
                            newPriceArray = arr['price'].split("")
                        }

                      let priceNew = ""
                        if(newPriceArray.length > 3){
                            newPriceArray.splice(newPriceArray.length - 3, 0 , ".")
                            priceNew = newPriceArray.join("")
                            if(index != -1){
                                priceNew = priceNew +"," + just[1]
                            }
                        }else{
                            priceNew = newPriceArray.join("")
                            if(index != -1){
                                priceNew = priceNew +"," + just[1]
                            }
                        } 

                      return(
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              value={arr._id}
                              onChange={handleId}
                              checked={checkboxItem.includes(arr['_id']) ? true : false}
                            />
                          </th>
                          <td className="td">{arr.material}</td>
                          <td className="td">{arr['serviceGroup']}</td>
                          <td className="td" style={!arr['materialGroup'] ? styleNotDefined: {}}>{arr['materialGroup'] ? arr['materialGroup'] : "notDefined"}</td>
                          <td className="td">{arr['service']}</td>
                          <td className="td">{arr['company_id']}</td>
                          <td className="td">{arr['priceVersion']}</td>
                          <td className="td" style={{textAlign: "right"}}>{priceNew}</td>
                          <td className="td" style={{textAlign: "right"}}>{arr['workingTime']}</td>
                          <td className="td"><span className={style.uploaded}>Uploaded</span></td>
                          <td className="td" style={{textTransform:"capitalize"}}>{arr['lastModifiedBy']['firstname'] + " " + arr['lastModifiedBy']['lastname']}</td>
                          <td className="td">{new Date(arr['lastModifiedDate']).toLocaleDateString()}</td>
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
                          <td></td>
                          <td className="td">{arr.material}</td>
                          <td className="td">{arr['service group']}</td>
                          <td className="td">{arr['service']}</td>
                          <td className="td">{arr['company code']}</td>
                          <td className="td">{arr['price version']}</td>
                          <td className="td">{arr['price']}</td>
                          <td className="td">{arr['working time']}</td>
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

      
      {/* create a customer dialogue */}
      <Dialog
        open={showUploadCSVForm}
        onClose={handleCloseCSVFormDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
         UploadNewPriceList
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
                Delete Pricings ?
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete the pricings ? 
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                <Button onClick={handleDeletePricings} autoFocus>
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
      {/* pricings upload circular progress */}
      <Dialog
        open={showPricingsUploadCountDialogue}
        // onClose={}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
        </DialogTitle>
        <DialogContent>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <div><CircularProgress/></div>
            <div style={{margin:"10px 0px 5px", fontWeight: "700", fontSize: "18px"}}><p>{pricingsCount} / {array.length}</p></div>
            <div style={{color: "#857d7d", fontWeight:"300"}}>Uploading</div>
            
    {/* color: #857d7d;
    font-weight: 300; */}

          </div>
        </DialogContent>
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


const styleNotDefined = {
  color: "red",
  fontWeight: "600"
}