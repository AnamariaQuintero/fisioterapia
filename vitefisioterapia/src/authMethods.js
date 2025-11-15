import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    linkWithPopup
  } from "firebase/auth";
  
  import { auth, GoogleProvider, GithubProvider } from "./firebase";
  
  // ---- LOGIN NORMAL ----
  export const loginEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  // ---- REGISTRO NORMAL ----
  export const registerEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  
  // ---- VINCULAR GOOGLE ----
  export const vincularGoogle = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Debes iniciar sesión primero.");
    return linkWithPopup(user, GoogleProvider);
  };
  
  // ---- VINCULAR GITHUB ----
  export const vincularGithub = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Debes iniciar sesión primero.");
    return linkWithPopup(user, GithubProvider);
  };