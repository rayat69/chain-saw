import firebase from 'firebase'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/auth'
import { shortUrlConverter } from './models'

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

const database = firebase.database()
const firestore = firebase.firestore()

export const shortUrlRef = database.ref().child('foo/shortly')

export const urlCol = firestore.collection('shortly').withConverter(shortUrlConverter)

// const a = firebase.firestore().collection('posts').withConverter(shortUrlConverter)
