import React, { useState, useContext } from "react";
import Logo from "./../../assets/img/a-logo.png";
import Time from "./../../assets/img/time-icon.svg";
import Quotations from "./../../assets/img/Quotations-icon.svg";
import Pricing from "./../../assets/img/Pricing-Table-icon.svg";
import Customer from "./../../assets/img/Customer-icon.png";
import Administration from "./../../assets/img/User-Administration.png";
import Template from "./../../assets/img/template.png";
import style from "./header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSortDown } from "@fortawesome/free-solid-svg-icons";
import search from "./../../assets/img/search.svg";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";

export default function Header() {
  const { dispatch } = useContext(Context)
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("dashboard");
  const { user } = useContext(Context);
  const handleTabChange = (val) => {
    setValue(val);
  };

  const handleLogOut = () => {
    dispatch({ type: "LOGOUT" });
  }

  return (
    <header>
      <nav
        className={`${style.bg_dark} ${style.navbar} ${style.navbar_expand_sm} ${style.navbar_dark}`}
      >
        <div className={style.container_fluid}>
          <Link 
            to={"/dashboard"}
            className={style.navbar_brand}
            onClick={() => handleTabChange("dashboard")}
          >
            <img src={Logo} className={style.img_fluid} />
          </Link>
          <button
            className={style.navbar_toggler}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsibleNavbar"
          >
            <span className={style.navbar_toggler_icon}></span>
          </button>
          <div
            className={`${style.collapse} ${style.navbar_collapse}`}
            id="collapsibleNavbar"
          >
            <ul className={style.navbar_nav}>

              {/* dashboard */}
              {user.data.modules.includes('dashboard')
              ?
              <li className={style.nav_item}>
               <Link
                 to={"/dashboard"}
                 className={`${style.textItme} ${style.time_set} ${
                   value === "dashboard" ? style.active : ""
                 }`}
                 onClick={() => handleTabChange("dashboard")}
               >
                 <span>
                   <img src={Time} className={style.img_fluid} />
                 </span>{" "}
                 Dashboard
               </Link>
             </li>
             :
             <></>
              
              }
             

              {/* quotations */}
              {
                user.data.modules.includes('quotations')
                ?
                <li className={style.nav_item}>
                <Link
                  to={"/quotation"}
                  className={`${style.textItme} ${
                    value === "quotation" ? style.active : ""
                  }`}
                  onClick={() => handleTabChange("quotation")}
                >
                  <span>
                    <img src={Quotations} className={style.img_fluid} height={22} />
                  </span>{" "}
                  Quotations
                </Link>
              </li>
                :
                <></>
              }
             

              {/* pricing table */}

              {
                user.data.modules.includes('pricing table')
                ?
                <li className={style.nav_item}>
                  <Link
                    to={"/priceTable"}
                    className={`${style.textItme} ${
                      value === "priceTable" ? style.active : ""
                    }`}
                    onClick={() => handleTabChange("priceTable")}
                  >
                    <span>
                      <img src={Pricing} className={style.img_fluid} />
                    </span>
                    Pricing Table
                  </Link>
                </li>
                :
                <></>
              }

              {
                user.data.modules.includes('material group')
                ?
                <li className={style.nav_item}>
                  <Link
                    to={"/materialGroup"}
                    className={`${style.textItme} ${
                      value === "materialGroup" ? style.active : ""
                    }`}
                    onClick={() => handleTabChange("materialGroup")}
                  >
                    <span>
                      <img src={Pricing} className={style.img_fluid} />
                    </span>
                    Material Group
                  </Link>
                </li>
                :
                <></>
              }
              
              {/* customers */}
              {
                user.data.modules.includes('customer')
                ?
                <li className={style.nav_item}>
                  <Link
                    to={"/customers"}
                    className={`${style.textItme} ${
                      value === "customer" ? style.active : ""
                    }`}
                    onClick={() => handleTabChange("customer")}
                  >
                    <span>
                      <img src={Customer} className={style.img_fluid} />
                    </span>
                    Customer
                  </Link>
                </li>
                :
                <></>
              }
              

              {/* user administration */}
              {
                user.data.modules.includes('user administration')
                ?
                <li className={style.nav_item}>
                  <Link
                    to={"/userAdministration"}
                    className={`${style.textItme} ${
                      value === "userAdministration" ? style.active : ""
                    }`}
                    onClick={() => handleTabChange("userAdministration")}
                  >
                    <span>
                      <img src={Administration} className={style.img_fluid} />
                    </span>
                    User Administration
                  </Link>
                </li>
                :
                <></>
              }
              {
                 user.data.modules.includes('languages')
                 ?
                 <li className={style.nav_item}>
                 <Link
                   to={"/languages"}
                   className={`${style.textItme} ${
                     value === "languages" ? style.active : ""
                   }`}
                   onClick={() => handleTabChange("languages")}
                 >
                   <span>
                     <img src={Administration} className={style.img_fluid} />
                   </span>
                    Languages
                 </Link>
               </li>
              :
              <></>
                }
                {
                 user.data.modules.includes('templates')
                 ?
                <li className={style.nav_item}>
                  <Link
                    to={"/templates"}
                    className={`${style.textItme} ${
                      value === "templates" ? style.active : ""
                    }`}
                    onClick={() => handleTabChange("templates")}
                  >
                    <span>
                      <img src={Template} className={style.img_fluid} />
                    </span>
                     Templates
                  </Link>
                </li>
                :
                <></>
              }
            </ul>
              {/* <div className={`${style.dropdown} ${style.myDIV} ${value !== "quotation" && style.btnhide}`}>
                <button
                  className={`${style.btn} ${style.color_btn} ${style.dropdown_toggle}`}
                  type="button"
                  onClick={() => setOpen(!open)}
                >
                  Optionen
                  <FontAwesomeIcon icon={faSortDown} />
                </button>
                {open && (
                  <ul
                    className={style.dropdown_menu}
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li>
                      <a className={style.dropdown_item} href="#">
                        creating new quotation
                      </a>
                    </li>
                  </ul>
                )}
              </div> */}
            <div className={style.search}>
              <input
                type="text"
                className={style.form_control}
                placeholder="Search"
              />
              <button className={`${style.btn} ${style.btn_primary}`}>
                <img src={search} className={style.img_fluid} />
              </button>
            </div>
              <button className={`${style.customBtn}`} onClick={handleLogOut}>
                Logout 
              </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
