import { string, date, number } from 'yup'

const emailRegex =
  /^(?=[A-Z0-9][A-Z0-9@._%+-]{5,253}+$)[A-Z0-9._%+-]{1,64}+@(?:(?=[A-Z0-9-]{1,63}+\.)[A-Z0-9]++(?:-[A-Z0-9]++)*+\.){1,8}+[A-Z]{2,63}+$/gi
const urlRegex =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g

const email = string()
  .required('Email is required')
  .email('Invalid email format')
  .matches(emailRegex, 'Invalid email format')
  .trim()
const name = string().required().max(16).trim()
const fullName = string().required().min(5).max(32).trim()
const age = number().integer().positive().max(3)
const birthDate = date()
const phone = number().integer().positive().min(7)
const url = string()
  .url('Invalid url format')
  .matches(urlRegex, 'Invalid url format')

export { email, name, fullName, age, birthDate, phone, url }
