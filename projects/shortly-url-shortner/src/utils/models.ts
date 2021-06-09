import firebase from 'firebase'

export class ShortURL {
  shortUrl: string
  createdAt: Date
  clicks: number
  constructor(public uid: string, public fullUrl: string, id: string) {
    this.shortUrl = id
    this.createdAt = new Date()
    this.clicks = 0
  }
}

export class RetrieveURL extends ShortURL {
  constructor(data: ShortURL, id: string) {
    super(data.uid, data.fullUrl, id)
    this.clicks = data.clicks
    this.createdAt = new Date(data.createdAt)
    this.shortUrl = data.shortUrl
  }
}

interface UrlDataX extends UrlData {
  shortUrl: string
  createdAt: Date
  clicks: number
}

interface UrlData {
  uid: string
  fullUrl: string
  id: string
}

export const shortUrlConverter: firebase.firestore.FirestoreDataConverter<ShortURL> =
  {
    toFirestore: function (data: ShortURL) {
      return {
        ...data,
        createdAt: data.createdAt.toUTCString(),
      }
    },
    fromFirestore: function (
      snapshot: firebase.firestore.DocumentSnapshot,
      options: firebase.firestore.SnapshotOptions
    ) {
      const data = snapshot.data(options) as ShortURL
      return new RetrieveURL(data, snapshot.id)
    },
  }
