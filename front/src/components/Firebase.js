// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDoN9po4EkJ3pirk-iDpkSHQP34zRdlkCk",
    authDomain: "polygon-hackathon.firebaseapp.com",
    projectId: "polygon-hackathon",
    storageBucket: "polygon-hackathon.appspot.com",
    messagingSenderId: "315592869542",
    appId: "1:315592869542:web:5f632e477c7d31b8c15667",
    measurementId: "G-LYLW96F6RK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firebaseFirestore = getFirestore(app);