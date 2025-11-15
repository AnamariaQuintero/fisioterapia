import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC15NN5dd5O-f_qI7HS3dVbLKDUrb8bucs",
  authDomain: "ejem-clases.firebaseapp.com",
  projectId: "ejem-clases",
  storageBucket: "ejem-clases.firebasestorage.app",
  messagingSenderId: "262241640373",
  appId: "1:262241640373:web:c34af773509fe8ba4103fc",
  measurementId: "G-YME93T0GBC"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);
const GoogleProvider = new GoogleAuthProvider();
const GithubProvider = new GithubAuthProvider();

// Firestore
const db = getFirestore(app);

// Exportar para toda la app
export { app, auth, GoogleProvider, GithubProvider, db, signOut };
