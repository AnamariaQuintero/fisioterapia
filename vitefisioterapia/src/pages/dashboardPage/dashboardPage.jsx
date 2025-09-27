import { Link } from "react-router-dom";
import { use } from "react";

// Simulamos una promesa (como si fuera una API)
const traerMensaje = new Promise((resolve) =>
  setTimeout(() => resolve("Hola desde el hook use"), 1000)
);

function DashboardPage() {
  // Usamos el hook use para "esperar" la promesa
  const mensaje = use(traerMensaje);

  return (
    <div className="container justify-content-center align-center vh-100">
      <div className="text-center">
        <h2>Ejemplo de use</h2>

        {/* Mostramos el mensaje de la promesa */}
        <p>{mensaje}</p>

        <Link to="/" className="list-group-item rounded bg-primary m-3 text-center">Ir al Home</Link>
      </div>
    </div>
  );
}

export default DashboardPage;
