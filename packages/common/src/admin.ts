import admin from 'firebase-admin'

import {
  project_id,
  client_email,
  private_key,
  database_url,
} from './credentials.json'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: project_id,
      clientEmail: client_email,
      privateKey: private_key,
    }),
    databaseURL: database_url,
  })
} else {
  admin.app()
}

export const adminDatabase = admin.database()
export const adminFirestore = admin.firestore()
export const adminAuth = admin.auth()
export const adminStorage = admin.storage()
