import React, { useState, useEffect , useContext  } from 'react';
import style from "./characteristics.module.css"
import { Context } from "../../context/Context";
import { axiosInstance } from "../../config";


export default function Characteristics({
  template,
  setTemplate,
  owner,
  setOwner,
  customer,
  contact,
  setContact,
  contact2,
  setContact2,
  offers,
  setOffers
}){
  const { user } = useContext(Context);
  const [templates, setTemplates] = useState([])
  const [showPlaceOrderButton, setShowPlaceOrderButton] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [users, setUsers] = useState([]);
  const [showUser, setShowUser] = useState(false)
  useEffect(() => { 
    fetchTemplates()
    fetchUser()
  }, [])

  const handleTemplateChange = (e) => {
    const thisTemplate = templates.filter((temp) => temp['name'] == e.target.value)
    setTemplate(thisTemplate[0])
  }

  const handleOwnerChange = (e) => {
    const thisOwner = users.filter((use) => e.target.value == use['_id'])
    setOwner(thisOwner[0])
  }

  const handleContactChange = (e) => {
    const thisContact = customer['contact'].filter((con) => con['_id'] == e.target.value)
    setContact(thisContact[0])
  }

  const handleContact2Change = (e) =>{
    const thisContact = customer['contact'].filter((con) => con['_id'] == e.target.value)
    setContact2(thisContact[0])
  }

  const handleChangePaymentDays = (e) => {
    offers['paymentDays'] = e.target.value
    setOffers({...offers})
  }

  const handleChangeValidDate = (e) => {
    offers['validDate'] = e.target.value
    setOffers({...offers})
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

  const fetchUser = async () => {
    setShowPlaceOrderButton(true)

    const res = await axiosInstance.post("auth/fetchAll", {
      token: user.data.token,
    });
    if(res.data.status == true){
      setUsers(res.data.data);
      setShowUser(true)
      setShowPlaceOrderButton(false);      
    }
  };



  return (
    <div className={style.tabOuter}>
      <div className={style.formCol}>
        <label>Contact</label>
        <select className={style.formControl} onChange={handleContactChange} value={contact['_id']}>
          <option disbled selected hidden value="">Contact</option>
          { 
          customer && customer['contact']
          ?
            customer['contact'].map((cont) => {
              return(
                <option value={cont['_id']}>{cont['contactPerson']}</option>
              )
            })
            :
            <></>
          }
        </select>
      </div>
      <div className={style.formCol}>
        <label>Contact 2</label>
        <select className={style.formControl} onChange={handleContact2Change} value={contact2['_id']}>
          <option disbled selected hidden value="">Contact 2</option>
          { 
          customer && customer['contact']
          ?
            customer['contact'].map((cont) => {
              return(
                <option value={cont['_id']}>{cont['contactPerson']}</option>
              )
            })
            :
            <></>
          }
        </select>
      </div>
      <div className={style.formCol}>
        <label>Templates</label>
        <select className={style.formControl} onChange={handleTemplateChange}>
          <option disbled selected hidden >Systems Templates</option>
          { showTemplates
          ?
            templates.map((temp) => {
              return(
                <option value={temp['name']}>{temp['name']}</option>
              )
            })
            :
            <></>
          }
        </select>
      </div>
      <div className={style.formCol}>
        <label>Owner</label>
        <select className={style.formControl} onChange={handleOwnerChange} value={owner ? owner['_id']: ""}>
          <option disbled selected hidden value="">Auswählen </option>
          { showUser
          ?
            users.map((user) => {
              return(
                <option value={user['_id']} selected={owner && owner['_id'] == user['_id'] ? true : false}>{user['firstname'] + " " + user['lastname']}</option>
              )
            })
            :
            <></>
          }
        </select>
      </div>
      <div className={style.formCol}>
        <label>Payments Terms</label>

        <input
          className={style.formControl}
          type="text"
          // placeholder={translations && translations['Angebotsnummer'] ? translations['Angebotsnummer'] : "{Angebotsnummer}"}
          placeholder="Payment Days"
          name=""
          value={offers['paymentDays'] ? offers['paymentDays'] : ""}
          onChange={handleChangePaymentDays}
        />
      </div>
      <div className={style.formCol}>
        <label>Valid Date</label>

        <input
          className={style.formControl}
          id="startDate"
          type="date"
          // placeholder={translations && translations['Angebotsnummer'] ? translations['Angebotsnummer'] : "{Angebotsnummer}"}
          placeholder="Valid Date "
          name=""
          value={offers['validDate'] ? offers['validDate'] : ""}
          onChange={handleChangeValidDate}
        />
      </div>

    {/* <div className={style.formCol}>
      <label>Standort</label>

      <select className={style.formControl}>
        <option>Systems GmbH</option>
      </select>
    </div>

    <div className={style.formCol}>
      <label>Angebotsnummer</label>

      <input
        className={style.formControl}
        type="number"
        name=""
        value="1050313120"
      />
    </div>

    <div className={style.formCol}>
      <label>Revision</label>

      <input
        className={style.formControl}
        type="number"
        name=""
        value="0"
      />
    </div>
  
    <div className={style.formCol}>
      <label>Wahrung</label>

      <select className={style.formControl}>
        <option>EUR</option>
      </select>
    </div>

    <div className={style.formCol + " " + style.disableInput}>
      <label>Umrechnungskurs</label>

      <input
        className={style.formControl}
        type="text"
        name=""
        value="0,000000"
        readOnly=""
      />
    </div>

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
    </div>

    <div className={style.formCol + " " + style.disableInput}>
      <label>Gesamtsumme</label>

      <input
        className={style.formControl}
        type="number"
        name=""
        value="60.000"
        pattern="^\d*(\.\d{0,2})?$"
        readOnly=""
      />
    </div> */}
  </div>
  )
}