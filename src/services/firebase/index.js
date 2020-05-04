import * as firebaseApp from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

const config = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: process.env.FIREBASE_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

// https://github.com/zeit/next.js/issues/1999#issuecomment-326805233
export const firebase = !firebaseApp.apps.length ? firebaseApp.initializeApp(config) : firebaseApp.app()
