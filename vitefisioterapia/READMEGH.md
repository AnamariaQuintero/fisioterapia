2025-II-AOS - Inicio de Sesión con GitHub

🧾 Descripción

El inicio de sesión con GitHub es una excelente opción para aplicaciones orientadas a desarrolladores o usuarios técnicos. GitHub es una de las plataformas más utilizadas del mundo para gestionar proyectos de software, por lo cual permite un acceso rápido, seguro y sin necesidad de crear una contraseña adicional.

Firebase facilita la integración gracias a su proveedor GitHub, manejando tokens, redirecciones y verificación automática del usuario.

🧰 Tecnologías usadas

1. JavaScript / React
2. Firebase
3. react-firebase-hooks
4. GitHub OAuth Apps
5. Firebase Auth
6. Bootstrap
7. SweetAlert2
8. Vite
9.  Firestore

📋 Dependencias necesarias
npm install firebase
npm install react-firebase-hooks
npm install bootstrap
npm install react-router-dom
npm install sweetalert2

🔧 Configuración del Inicio de Sesión con GitHub
1. Crear una OAuth App en GitHub

Ir a
https://github.com/settings/developers

Clic en New OAuth App.
Rellenar los campos:
Application name: nombre de tu app
Homepage URL:
http://localhost:5173
Authorization callback URL: inicialmente colocar:
https://TU_PROYECTO.firebaseapp.com/__/auth/handler
Guardar.
Copiar:
    Client ID
    Client Secret

⚠ Luego Firebase generará una URL de callback definitiva. Esa URL se reemplaza nuevamente en GitHub.

2. Configurar el proveedor GitHub en Firebase

Ir a la consola de Firebase
https://console.firebase.google.com

Seleccionar tu proyecto.
Ir a Authentication → Sign-in method.
Activar GitHub.

Colocar: 
    Client ID
    Client Secret
Guardar.

Firebase mostrará la URL de callback oficial.
Esta debe copiarse nuevamente en la configuración de GitHub.

🔄 Flujo de autenticación

Usuario hace clic en "Continuar con GitHub".
GitHub abre un popup pidiendo permisos.
El usuario autoriza la aplicación.
GitHub envía un código de autorización a Firebase.
Firebase intercambia ese código por un token seguro.
Se verifica en Firestore:
Si el correo ya existe → se inicia sesión.
Si existe con otro proveedor → se vincula.
Si es nuevo → se crea un documento en Firestore.
Se redirige al dashboard o página privada.

💾 Estructura de usuario en Firestore

Es recomendable almacenar datos mínimos:

{
  "uid": "ID DEL USUARIO",
  "displayName": "Nombre mostrado",
  "email": "Correo asociado",
  "provider": "github",
  "photoURL": "Avatar GitHub",
  "createdAt": "Timestamp"
}

▶️ Función para iniciar sesión con GitHub
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

const providerGithub = new GithubAuthProvider();

export const loginGithub = async () => {
  try {
    const result = await signInWithPopup(auth, providerGithub);
    return result.user;
  } catch (error) {
    throw error;
  }
};

🧑‍💻 Integración en React
<button onClick={loginGithub} className="btn btn-dark w-100">
  Iniciar sesión con GitHub
</button>

🛡️ Ventajas de usar GitHub Sign-In

✔ Ideal para aplicaciones para desarrolladores
✔ Seguridad avanzada con OAuth2
✔ Información del perfil verificada
✔ Integración directa con Firebase
✔ Permite vincular cuentas con otros proveedores

📌 Nota

Se deben registrar todos los dominios de producción en
Authentication → Settings → Authorized Domains.

GitHub no permite múltiples URLs de callback, pero Firebase usa solo una.

Se puede vincular GitHub a un usuario existente usando linkWithPopup.