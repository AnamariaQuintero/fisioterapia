2025-II-AOS - Inicio de Sesión con Google

🧾 Descripción

El inicio de sesión con Google es uno de los métodos de autenticación más usados debido a su seguridad, rapidez y facilidad de integración. Millones de usuarios poseen una cuenta de Google, lo cual permite que las aplicaciones web ofrezcan un acceso inmediato sin necesidad de registrar nuevas credenciales.

Integrar Google Sign-In con Firebase simplifica el proceso, gestionando automáticamente tokens, redirecciones, permisos y creación de usuarios en Firestore.

🧰 Tecnologías usadas

1. JavaScript / React
2. Firebase
3. react-firebase-hooks
4. Google OAuth con Firebase Auth
5. Bootstrap
6. SweetAlert2
7. Vite
8. Firestore

📋 Dependencias necesarias

Instálalas con:

npm install firebase
npm install react-firebase-hooks
npm install bootstrap
npm install react-router-dom
npm install sweetalert2

🔧 Configuración del Inicio de Sesión con Google
1. Configurar Google en Firebase

Ir a la consola de Firebase:
https://console.firebase.google.com

Seleccionar el proyecto.

Ir a Authentication → Sign-in method.
Habilitar el proveedor Google.

Esto habilita automáticamente el flujo OAuth de Google sin necesidad de crear manualmente un OAuth App en Google Cloud (Firebase lo gestiona internamente).

2. Configurar Firebase en tu proyecto

En el archivo firebase.js:

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const providerGoogle = new GoogleAuthProvider();
export const db = getFirestore(app);

🔄 Flujo de autenticación

Usuario hace clic en "Continuar con Google".
Firebase abre un popup solicitando elegir o iniciar sesión en Google.
Google solicita confirmación del usuario.
Firebase recibe el token de autenticación de Google.
Se verifica en Firestore:
    1. Si el usuario ya existe → se accede normalmente.
    2. Si es nuevo usuario → se crea el documento en Firestore.
    3. Si tiene otra cuenta social → Firebase permite vincularla.
    4. Redirige al dashboard o pantalla protegida.

💾 Registro/Verificación en Firestore

La mejor práctica consiste en guardar información básica del usuario:

{
  uid: "ID DEL USUARIO",
  displayName: "Nombre del usuario",
  email: "Correo del usuario",
  provider: "google",
  createdAt: Timestamp.now()
}

▶️ Función de inicio de sesión con Google

Ejemplo estándar:

import { signInWithPopup } from "firebase/auth";
import { auth, providerGoogle } from "../firebase";

export const loginGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, providerGoogle);
    return result.user;
  } catch (error) {
    throw error;
  }
};

🧑‍💻 Uso en React
<button onClick={loginGoogle} className="btn btn-danger w-100">
  Iniciar sesión con Google
</button>

🛡️ Ventajas de usar Google Sign-In

✔ No requiere crear usuario ni recordar contraseñas
✔ Mayor seguridad (OAuth2 + tokens firmados)
✔ Multi-dispositivo
✔ Ideal para apps modernas con Firebase

📌 Nota

Firebase gestiona automáticamente los tokens, renovaciones y protección contra ataques.
Puedes combinar Google con otros proveedores (GitHub, Microsoft, email/password).
Para producción debes agregar el dominio en Authentication → Settings → Authorized Domains.