export const validateField = (name, value, formData = {}) => {

let message = "";

if (name === "name") {

const nameRegex = /^[A-Za-z]+( [A-Za-z]+)*$/;

const trimmed = value.trim();

if (!trimmed) message = "Name is required";

else if (trimmed.length < 3) message = "Name must be at least 3 characters";

else if (trimmed.length > 50) message = "Name too long";

else if (!nameRegex.test(trimmed)) message = "Name must contain alphabets only";

}



if (name === "email") {

const val = value.trim();

const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,3}$/;

if (!val) message = "Email is required";

else if (!emailRegex.test(val)) message = "Invalid email address";

}



const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;



if (name === "password") {

if (!value) message = "Password is required";

else if (value.length < 8) message = "Password must be at least 8 characters";

else if (value.length > 20) message = "Password too long";

else if (!passwordRegex.test(value))

message = "Must include uppercase, lowercase, number and special character";

}



if (name === "confirmPassword") {

if (!value) message = "Confirm password is required";

else if (value !== formData.password)

message = "Passwords do not match";

}



return message;

};



export const validateForm = (formData) => {

const errors = {};

Object.keys(formData).forEach((key) => {

const error = validateField(key, formData[key], formData);

if (error) errors[key] = error;

});

return errors;

};