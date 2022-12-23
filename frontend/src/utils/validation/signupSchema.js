import * as yup from "yup";

const signupSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .min(5, "Username length must be min 5 ")
    .max(20, "Username length must be max 5"),
  email: yup.string().email().required(),
  password: yup.string().required()
});

export default signupSchema;
