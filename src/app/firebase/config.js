// firebase/config.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, increment} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyApVWLXuf-Wa53LKsmkUTdPyVJwPJydqBI",
  authDomain: "rpgskill-85931.firebaseapp.com",
  projectId: "rpgskill-85931",
  storageBucket: "rpgskill-85931.appspot.com",
  messagingSenderId: "294487261492",
  appId: "1:294487261492:web:4080ac4512132c63716561"
};

let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}


const auth = getAuth(firebaseApp);
const defaultDb= getFirestore(firebaseApp)

export { auth, defaultDb };
