import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCOji5CoVTe66_g3C1Z-hYqBX1qKSfWfCE",
  authDomain: "whatsapp-redux-clone.firebaseapp.com",
  projectId: "whatsapp-redux-clone",
  storageBucket: "whatsapp-redux-clone.appspot.com",
  messagingSenderId: "64276158570",
  appId: "1:64276158570:web:26f2befc55673d81a9d213",
  measurementId: "G-0FMZDLEJJF",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };

export default db;
