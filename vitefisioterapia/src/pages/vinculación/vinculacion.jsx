import React, { useState } from "react";
import {
  loginEmail,
  registerEmail,
  vincularGoogle,
  vincularGithub
} from "../../authMethods";
import "./vinculacion.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginEmail(email, password);
      alert("Sesión iniciada");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await registerEmail(email, password);
      alert("Usuario registrado");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVincularGoogle = async () => {
    try {
      await vincularGoogle();
      alert("Google vinculado correctamente");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVincularGithub = async () => {
    try {
      await vincularGithub();
      alert("GitHub vinculado correctamente");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
      <div className="auth-card">

        <h2 className="auth-title">Proveedores</h2>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />

        <button className="auth-btn btn-main" onClick={handleLogin}>
          Iniciar sesión
        </button>

        <hr className="auth-divider" />

        <h3 className="auth-subtitle">Vincular proveedores</h3>

        <button className="auth-btn btn-google" onClick={handleVincularGoogle}>
          Vincular Google
        </button>

        <button className="auth-btn btn-github" onClick={handleVincularGithub}>
          Vincular GitHub
        </button>
      </div>

  );
}


