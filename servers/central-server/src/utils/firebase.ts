import admin from 'firebase-admin'

import credentials from '../credentials.json'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: credentials.project_id,
      clientEmail: credentials.client_email,
      privateKey: credentials.private_key,
    }),
    databaseURL: credentials.database_url,
  })
} else {
  admin.app()
}

const db = admin.database()

export const shortUrlRef = db.ref().child('foo/shortly')
