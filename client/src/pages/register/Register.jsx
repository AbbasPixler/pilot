import React, { useState } from "react";
import style from "./register.module.css";
import Registerbackground from "./../../assets/img/Register-banner.png";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../config";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      user: {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      },
    };
    if (
      firstname === "" ||
      lastname === "" ||
      email === "" ||
      password === ""
    ) {
      setOpen(true);
      setError(true);
      setErrorMsg("Please fill this input!");
    } else {
      setIsLoading(true);
      const res = await axiosInstance.post("/auth/create", newUser);
      if (res.data.status === true) {
        setIsLoading(false);
        setOpen(true);
        setSuccess(true);
        setSuccessMsg(res.data.message);
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
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
      style={{ background: `url(${Registerbackground})` }}
    >
      <div className={style.container_fluid}>
        <div className={style.row}>
          <div className={style.colFour}>
            <div className={style.dataOuter}>
              <form className={style.loginForm}>
                <div className={style.formWrapper}>
                  <h1>Register</h1>

                  <div className={style.mb3}>
                    <input
                      type="text"
                      className={style.formControl}
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      placeholder="Firstname"
                    />
                  </div>

                  <div className={style.mb3}>
                    <input
                      type="text"
                      className={style.formControl}
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      placeholder="Lastname"
                    />
                  </div>

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
                    <input
                      type="password"
                      className={style.formControl}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                    />
                  </div>

                  <div className={style.mb3}>
                    <div className={style.innerBox}>
                      <p className={style.already}>
                        Already register?
                        <Link
                          to="/"
                          style={{
                            textDecoration: "underline",
                            marginLeft: "4px",
                            color: "#0d6efd",
                          }}
                        >
                          Login Here
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
                      {isLoading ? "loading..." : "Register"}
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
