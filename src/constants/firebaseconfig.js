// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBzRycgyTTtfOAE4yOkRPQDzR248yFCUX0",
    authDomain: "contact-us-dcb00.firebaseapp.com",
    projectId: "contact-us-dcb00",
    storageBucket: "contact-us-dcb00.appspot.com",
    messagingSenderId: "1011169237064",
    appId: "1:1011169237064:web:d9b0b594b283094ab2e07d"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
