import React, { useState } from "react";
import { auth, GithubProvider, db } from "../../firebase";
import { linkWithPopup } from "firebase/auth";
import Swal from "sweetalert2";
import { addDoc, collection } from "firebase/firestore";

export default function VincularGithubButton() {
  const [loading, setLoading] = useState(false);

  const handleVincularGithub = async () => {
    if (!auth.currentUser) {
      return Swal.fire("Error", "Debes iniciar sesión primero.", "error");
    }

    setLoading(true);
    try {
      const result = await linkWithPopup(auth.currentUser, GithubProvider);
      const user = result.user;

      // Registrar en Firestore que se vinculó GitHub
      await addDoc(collection(db, "usuario_providers"), {
        uid: user.uid,
        provider: "github",
        email: user.email,
        displayName: user.displayName,
        linkedAt: new Date(),
      });

      Swal.fire("Éxito", "GitHub vinculado correctamente.", "success");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/credential-already-in-use") {
        Swal.fire(
          "Error",
          "Esta cuenta de GitHub ya está vinculada con otro usuario.",
          "error"
        );
      } else if (error.code === "auth/account-exists-with-different-credential") {
        Swal.fire(
          "Error",
          "Este correo ya está registrado con otro proveedor. Usa el proveedor original para iniciar sesión primero.",
          "error"
        );
      } else {
        Swal.fire("Error", error.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleVincularGithub} disabled={loading}>
      {loading ? "Vinculando GitHub..." : "Vincular con GitHub"}
    </button>
  );
}
