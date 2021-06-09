import firebase from 'firebase'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const conf = {
  apiKey: 'AIzaSyDqZvo3uqrqclPxPiYjS7E8hf3xSIoYWBI',
  authDomain: 'auth-development-faab3.firebaseapp.com',
  databaseURL: 'https://auth-development-faab3-default-rtdb.firebaseio.com',
  projectId: 'auth-development-faab3',
  storageBucket: 'auth-development-faab3.appspot.com',
  appId: '1:838575164828:web:33a42eca722e76a0e60c59',
}

if (!firebase.apps.length) {
  firebase.initializeApp(conf)
} else {
  firebase.app()
}

export const database = firebase.database()
export const firestore = firebase.firestore()
export const auth = firebase.auth()
export const storage = firebase.storage()
