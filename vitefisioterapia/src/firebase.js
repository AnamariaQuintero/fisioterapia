import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC15NN5dd5O-f_qI7HS3dVbLKDUrb8bucs",
  authDomain: "ejem-clases.firebaseapp.com",
  projectId: "ejem-clases",
  storageBucket: "ejem-clases.firebasestorage.app",
  messagingSenderId: "262241640373",
  appId: "1:262241640373:web:c34af773509fe8ba4103fc",
  measurementId: "G-YME93T0GBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Variable para obtener funcionalidad de autenticación
const auth = getAuth(app);
const GoogleProvider = new GoogleAuthProvider()
// Conexión a db
const db = getFirestore(app);
// Exportar variables para consumo del proyecto 
export{ auth, GoogleProvider,  db, signOut };