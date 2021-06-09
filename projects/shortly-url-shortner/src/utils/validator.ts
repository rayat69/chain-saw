import { string, object } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const urlRegex =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g

const urlSchema = object({
  fullUrl: string()
    .url('Invalid url format')
    .required('Please add a link')
    .matches(urlRegex, 'Invalid url format'),
}).required()

export const urlResolver = yupResolver(urlSchema)
