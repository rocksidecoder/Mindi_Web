import React, { useContext, useEffect } from "react";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import InputField from "../shared/inputField/index";
import { Formik } from "formik";
import loginSchema from "../../utils/validation/loginSchema";
import { loginIntials } from "../../utils/initials";
import { userContext } from "../../context/userContext";
import { Box, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setError } from "../../http/error";
import toastMessage from "../../utils/toast";
import "./login.css";
import authAxios from "../../http/authAxios";
import { toastTypes } from "../../utils/helper";

const Login = () => {
  const navigate = useNavigate();
  const { setLoginDetail } = useContext(userContext);
  const userLogin = async (user) => {
    try {
      const res = await authAxios.post("/auth/login", user);

      if (res.data) {
        localStorage.setItem("user-info", JSON.stringify(res.data.data));
        setLoginDetail(res.data.data);
        toastMessage(res.data.message, toastTypes.success);
        navigate("/home");
        return;
      }
    } catch (error) {
      const message = setError(error);
      toastMessage(message, toastTypes.error);
    }
  };

  return (
    <Paper sx={{ width: "100%", maxWidth: "375px" }} elevation={3}>
      <Box>
        <Formik
          initialValues={loginIntials}
          validationSchema={loginSchema}
          validateOnChange={false}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            userLogin(values);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                  rowGap: "15px"
                }}
              >
                <Grid item xs={12}>
                  <h2 className="loginHeader">Login</h2>
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    type="text"
                    name="email"
                    value={values.email}
                    icon={<EmailIcon />}
                    handleChange={(e) => setFieldValue("email", e.target.value)}
                    onBlur={handleBlur}
                    label="Email"
                    id="filled-error-helper-text"
                    error={errors.email ? true : false}
                    helperText={errors.email || " "}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    type="password"
                    name="password"
                    value={values.password}
                    icon={<LockIcon />}
                    handleChange={handleChange}
                    onBlur={handleBlur}
                    label="Password"
                    id="outlined-error-helper-text"
                    error={errors.password ? true : false}
                    helperText={errors.password || " "}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    sx={{ width: "100%", margin: "0 10px 12px" }}
                    disabled={isSubmitting}
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </Paper>
  );
};

export default Login;
