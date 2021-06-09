// import { nanoid } from 'nanoid'

export class ShortURL {
  clicks: number
  createdAt: Date
  constructor(public fullUrl: string, public uid: string) {
    this.clicks = 0
    this.createdAt = new Date()
  }
}

export class RetrieveURL {
  clicks: number
  createdAt: Date
  originalUrl: string
  shortUrl: string
  fullShortUrl: string
  code: string
  constructor(url: ShortURL, id: string) {
    this.clicks = url.clicks
    this.createdAt = new Date(url.createdAt)
    this.originalUrl = url.fullUrl
    this.code = id
    this.shortUrl = `localhost:4000/short/${id}`
    this.fullShortUrl = `http://localhost:4000/short/${id}`
  }
}
