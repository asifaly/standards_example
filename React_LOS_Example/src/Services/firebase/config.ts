import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "",
    authDomain: "loan-origination-service.firebaseapp.com",
    projectId: "loan-origination-service",
    storageBucket: "loan-origination-service.appspot.com",
    messagingSenderId: "",
    appId: ""
}

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const storage = getStorage(app);


export {
    firestore,
    storage
}
