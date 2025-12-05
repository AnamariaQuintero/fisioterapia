import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth } from "../../firebase";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const verification = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuth(true);
        setLoading(false);
      } else {
        setLoading(false);

        Swal.fire({
          icon: "error",
          title: "Acceso restringido",
          text: "Debes iniciar sesión para continuar.",
          confirmButtonText: "Ir al login",
        }).then(() => {
          navigate("/", { replace: true });
        });
      }
    });

    return () => verification();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ display: "flex",justifyContent: "center", alignItems: "center",height: "100vh",fontSize: "20px", }} >
        Cargando...
      </div>
    );
  }

  if (!isAuth) return null;

  return children;
}
