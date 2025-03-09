// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Add this for authentication

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAvOIXtG4SNoKoMIPbZbt-3NPxijGA3Xzs",
    authDomain: "home-bot-26a90.firebaseapp.com",
    projectId: "home-bot-26a90",
    storageBucket: "home-bot-26a90.firebasestorage.app", // This is the correct value from your config
    messagingSenderId: "34048103440",
    appId: "1:34048103440:web:4439cfd719ad26a1342695",
    measurementId: "G-6B3LFE382Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize authentication

// Export what we need to use in other files
export { auth };
