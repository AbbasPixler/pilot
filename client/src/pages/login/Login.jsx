import React, { useState, useContext } from "react";
import style from "./login.module.css";
import LogInbackground from "./../../assets/img/Log-In-banner.png";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import { axiosInstance } from "../../config";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Login() {
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { dispatch, isFetching } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setError(true);
      setOpen(true);
      setErrorMsg("username and password cannot be empty!");
    } else {
      setIsLoading(true);
      dispatch({ type: "LOGIN_START" });
      try {
        const res = await axiosInstance.post("auth/login", {
          email: username,
          password: password,
        });
        if (res.data.status === true) {
          setIsLoading(false);
          console.log("response login: ", res.data)
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        } else {
          setIsLoading(false);
          setError(true);
          setOpen(true);
          setErrorMsg(res.data.message);
          dispatch({ type: "LOGIN_FAILURE" });
        }
      } catch (e) {
        setIsLoading(false);
        setError(true);
        setOpen(true);
        setErrorMsg(e.data.message);
        dispatch({ type: "LOGIN_FAILURE" });
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setError(false);
  };

  return (
    <section
      className={style.outer_banner_wrapper}
      style={{ background: `url(${LogInbackground})` }}
    >
      <div className={style.container_fluid}>
        <div className={style.row}>
          <div className={style.colFour}>
            <div className={style.dataOuter}>
              <form className={style.loginForm}>
                <div className={style.formWrapper}>
                  <h1>Login</h1>

                  <div className={style.mb3}>
                    <input
                      type="text"
                      className={style.formControl}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="E-Mail"
                    />
                  </div>

                  <div className={style.mb3}>
                    <input
                      type="password"
                      className={style.formControl}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                    />
                  </div>

                  <div className={style.mb3}>
                    <div className={style.innerBox}>
                      <p>
                        <Link to="/forgetPassword" className={style.forget}>
                          Forgot Your Password?
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className={style.allbtn}>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className={` ${style.customBtn}`}
                    >
                      {isLoading ? "loading..." : "Login"}
                    </button>

                    <Link
                      to={"/register"}
                      className={`${style.customBtn} ${style.btnColor}`}
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
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
