// @ts-check
import { Box, Button, Grid, Paper } from "@mui/material";
import Person3Icon from "@mui/icons-material/Person3";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { Formik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import { setError } from "../../http/error";
import { signupIntials } from "../../utils/initials";
import toastMessage from "../../utils/toast";
import signupSchema from "../../utils/validation/signupSchema";
import InputField from "../shared/inputField";
import "./signup.css";
import authAxios from "../../http/authAxios";
import { toastTypes } from "../../utils/helper";

const Signup = () => {
  const navigate = useNavigate();
  const signup = async (user) => {
    try {
      const res = await authAxios.post("/auth/signup", user);

      if (res.data.message) {
        return navigate("/login");
      }
    } catch (error) {
      const message = setError(error);
      return toastMessage(message, toastTypes.error);
    }
  };
  return (
    <Paper sx={{ width: "100%", maxWidth: "375px" }} elevation={3}>
      <Box>
        <Formik
          initialValues={signupIntials}
          validationSchema={signupSchema}
          validateOnChange={false}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            signup(values);
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
                  padding: "20px"
                }}
              >
                <Grid item xs={12}>
                  <h2 className="signupHeader">Sign Up</h2>
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    type="text"
                    name="username"
                    value={values.username}
                    icon={<Person3Icon />}
                    handleChange={(e) =>
                      setFieldValue("username", e.target.value)
                    }
                    onBlur={handleBlur}
                    label="Username"
                    id="filled-error-helper-text"
                    error={errors.username ? true : false}
                    helperText={errors.username || " "}
                  />
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
                    Sign Up
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

export default Signup;
