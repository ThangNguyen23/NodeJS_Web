import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKxoG8aoSKwNSguqae-MRd5Q4N79yoSW8",
    authDomain: "video-624d6.firebaseapp.com",
    projectId: "video-624d6",
    storageBucket: "video-624d6.appspot.com",
    messagingSenderId: "208518890553",
    appId: "1:208518890553:web:15bb8718bd16f7216039e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const provider = new GoogleAuthProvider()

export default app