import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from "./password.module.css";
import Passwordbackground from "./../../assets/img/Forgot-Password-banner.png";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { axiosInstance } from "../../config";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ChangePassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPassword = {
      password: password,
      token: token,
    };
    if (password === "" || matchPassword === "") {
      setOpen(true);
      setError(true);
      setErrorMsg("please fill this input !");
    } else if (password !== matchPassword) {
      setOpen(true);
      setError(true);
      setErrorMsg("Password doesn't matched!");
    } else {
      setIsLoading(true);
      const res = await axiosInstance.post("/auth/changePassword", newPassword);
      if (res.data.status === true) {
        setIsLoading(false);
        setOpen(true);
        setSuccess(true);
        setSuccessMsg(res.data.message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
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
                  <h1>Password</h1>
                  <div className={style.mb3}>
                    <input
                      type="password"
                      value={password}
                      className={style.formControl}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New Password"
                    />
                  </div>

                  <div className={style.mb3}>
                    <input
                      type="password"
                      className={style.formControl}
                      value={matchPassword}
                      onChange={(e) => setMatchPassword(e.target.value)}
                      placeholder="Confirm New Password"
                    />
                  </div>

                  <div className={style.mb3}>
                    <div className={style.innerBox}></div>
                  </div>

                  <div className={style.allbtn}>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className={` ${style.customBtn}`}
                    >
                      {isLoading ? "loading..." : "Change Password"}
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
