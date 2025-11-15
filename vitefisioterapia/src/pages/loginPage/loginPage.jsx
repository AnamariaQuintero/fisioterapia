import React, { useState } from "react";
import {
  loginEmail,
  registerEmail,
  vincularGoogle,
  vincularGithub
} from "../../authMethods";

import { auth } from "../../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ---- Login con Email ----
  const handleLogin = async () => {
    try {
      await loginEmail(email, password);
      alert("Sesión iniciada");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // ---- Registro ----
  const handleRegister = async () => {
    try {
      await registerEmail(email, password);
      alert("Usuario registrado");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // ---- Vincular Google ----
  const handleVincularGoogle = async () => {
    try {
      await vincularGoogle();
      alert("Google vinculado correctamente");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // ---- Vincular GitHub ----
  const handleVincularGithub = async () => {
    try {
      await vincularGithub();
      alert("GitHub vinculado correctamente");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Iniciar sesión</button>
      <button onClick={handleRegister}>Registrar usuario</button>

      <hr />

      <h3>Vincular proveedores</h3>

      <button onClick={handleVincularGoogle}>Vincular Google</button>
      <button onClick={handleVincularGithub}>Vincular GitHub</button>
    </div>
  );
}