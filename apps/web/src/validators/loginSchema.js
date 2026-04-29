import * as yup from 'yup';

export const phoneSchema = yup.object({
  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
});

export const otpSchema = yup.object({
  otp: yup
    .string()
    .required('Enter the 6-digit OTP')
    .matches(/^\d{6}$/, 'OTP must be 6 digits'),
});
