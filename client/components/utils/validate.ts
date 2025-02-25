import * as yup from 'yup';

// email regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// password regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validateRegisterSchema = yup.object().shape({
    name: yup.string().min(3).required('Name is required').trim(),
    email: yup.string().matches(emailRegex, 'Invalid Email').required('Email is required'),
    password: yup.string().matches(passwordRegex, 'Password must include at least one number, one uppercase letter, one lowercase letter, and one special character').required('Password is required')
})


export const ValidateLoginSchema = yup.object().shape({
    email: yup.string().matches(emailRegex, 'Invalid Email').required('Email is required'),
    password: yup.string().required('Password is required')
})