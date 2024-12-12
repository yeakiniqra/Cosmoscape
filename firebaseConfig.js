import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence,initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";




// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);