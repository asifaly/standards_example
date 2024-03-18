import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyADVVqpl9zS0-YygOJ-mFZPbCB9cvArlTM",
    authDomain: "loan-origination-service.firebaseapp.com",
    projectId: "loan-origination-service",
    storageBucket: "loan-origination-service.appspot.com",
    messagingSenderId: "640669555808",
    appId: "1:640669555808:web:bb1accd5df738102717705"
}

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const storage = getStorage(app);


export {
    firestore,
    storage
}