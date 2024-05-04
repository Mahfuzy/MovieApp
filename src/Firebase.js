import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: " AIzaSyDX_BBq2BThHsMM51y7hXY7FkjpwKJAs1o",
    authDomain: "netflix-clone-ee743.firebaseapp.com",
    projectId: "netflix-clone-ee743",
}

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();