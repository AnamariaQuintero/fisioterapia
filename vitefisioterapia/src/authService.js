import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  linkWithPopup,
  fetchSignInMethodsForEmail,
  linkWithCredential
} from "firebase/auth";

import { auth, GoogleProvider, GithubProvider } from "./firebase";

// --- Login Email/Password ---
export const loginEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// --- Registro Email/Password ---
export const registerEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// --- Vincular Google ---
export const vincularGoogle = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Debes iniciar sesión primero.");
  return linkWithPopup(user, GoogleProvider);
};

// --- Vincular GitHub ---
export const vincularGithub = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Debes iniciar sesión primero.");
  return linkWithPopup(user, GithubProvider);
};
