import { string, date, number } from 'yup'

const email = string()
  .required('Email is required')
  .email('Invalid email format')
  .trim()
const name = string().required().max(30).trim()
const fullName = string().required().min(5).max(60).trim()
const age = number().integer().positive().max(3)
const birthDate = date()
const phone = number().integer().positive().min(7)
const url = string().url('Invalid url format')

export { email, name, fullName, age, birthDate, phone, url }
