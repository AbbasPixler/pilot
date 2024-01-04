import React, { useState } from "react";
import style from "./password.module.css";
import Passwordbackground from "./../../assets/img/Forgot-Password-banner.png";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { axiosInstance } from "../../config";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailVerify = {
      email: email,
    };
    if (email === "") {
      setOpen(true);
      setError(true);
      setErrorMsg("please fill this input !");
    } else {
      setIsLoading(true);
      const res = await axiosInstance.post(
        "/auth/forgetPasswordEmailVerify",
        emailVerify
      );
      if (res.data.status === true) {
        setIsLoading(false);
        setOpen(true);
        setSuccess(true);
        setSuccessMsg("Please check your email.");
        navigate("/")
        setEmail("");
      } else {
        setIsLoading(false);
        setOpen(true);
        setError(true);
        setErrorMsg(res.data.message);
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setOpen(false);
    setError(false);
  };

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
                  <h1>ForgottenPassword</h1>

                  <div className={style.mb3}>
                    <input
                      type="text"
                      className={style.formControl}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-Mail"
                    />
                  </div>

                  <div className={style.mb3}>
                    <div className={style.innerBox}></div>
                  </div>
                  <div className={style.mb3}>
                    <div className={style.innerBox}>
                      <p className={style.already}>
                        Back To 
                        <Link
                          to="/"
                          style={{
                            textDecoration: "underline",
                            marginLeft: "4px",
                            color: "#0d6efd",
                          }}
                        >
                          Login
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className={style.allbtn}>
                    <button
                      type="button"
                      className={` ${style.customBtn}`}
                      onClick={handleSubmit}
                    >
                      {isLoading ? "loading..." : "Send New Password"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {success && (
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
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
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {errorMsg}
          </Alert>
        </Snackbar>
      )}
    </section>
  );
}
