import * as yup from 'yup';

export const profileSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Name is too short')
    .max(60, 'Keep it under 60 characters')
    .required('Name is required'),
  dob: yup
    .string()
    .nullable()
    .test('past-date', 'Date of birth must be in the past', (v) =>
      !v ? true : new Date(v).getTime() < Date.now()
    ),
  gender: yup
    .string()
    .nullable()
    .oneOf([null, 'male', 'female', 'other', 'no_answer'], 'Pick one'),
  bloodGroup: yup.string().nullable(),
});

export const addressSchema = yup.object({
  label: yup.string().trim().required('Label is required').max(20),
  name: yup.string().trim().required('Recipient name is required').max(60),
  phone: yup
    .string()
    .trim()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
    .required('Phone is required'),
  line1: yup.string().trim().required('Address line 1 is required').max(100),
  line2: yup.string().trim().max(100),
  landmark: yup.string().trim().max(60),
  city: yup.string().trim().required('City is required').max(40),
  state: yup.string().trim().required('State is required').max(40),
  pincode: yup
    .string()
    .matches(/^\d{6}$/, 'Pincode must be 6 digits')
    .required('Pincode is required'),
  isDefault: yup.boolean().default(false),
});
