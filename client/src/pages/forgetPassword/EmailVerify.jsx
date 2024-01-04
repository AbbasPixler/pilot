import React from "react";
import style from "./password.module.css";
import Passwordbackground from "./../../assets/img/Forgot-Password-banner.png";
import Verify from './../../assets/img/check.png'
import { Link } from "react-router-dom";


export default function EmailVerify() {

  return (
    <section
      className={style.outer_banner_wrapper}
      style={{ background: `url(${Passwordbackground})` }}
    >
      <div className={style.container_fluid}>
        <div className={style.row}>
          <div className={style.colFour}>
            <div className={style.dataOuter}>
              <form className={style.loginForm}>
                <div className={style.formWrapper}>
                  <img src={Verify} alt="check"  />
                  <h2>Your email is Verified.</h2>
                  <div className={style.allbtn}>
                    <Link to={"/"} className={style.customBtn}>
                      Login
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
     
    </section>
  );
}
