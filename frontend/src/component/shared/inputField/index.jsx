import { FormControl, InputAdornment, TextField } from "@mui/material";
import React from "react";

const InputField = ({
  label,
  icon,
  handleChange,
  value,
  position = "start",
  type = "text",
  ...props
}) => {
  return (
    <FormControl variant="standard" sx={{ width: "100%" }}>
      <TextField
        type={type}
        label={label}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {icon ? icon : " "}
            </InputAdornment>
          )
        }}
        onChange={handleChange}
        value={value}
        {...props}
      />
    </FormControl>
  );
};

export default InputField;
