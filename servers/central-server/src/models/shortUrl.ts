import { nanoid } from 'nanoid'

export class Short {
  shortUrl: string
  clicks: number
  createdAt: Date
  constructor(public fullUrl: string) {
    this.shortUrl = nanoid(7)
    this.clicks = 0
    this.createdAt = new Date()
  }
}
