import React, { useEffect, useState } from "react";
import NavbarPage from "../components/navbarPage";
import FooterPage from "../components/footerPage";

import { db } from "../../firebase"; 
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function ListaAuditoria() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(
          collection(db, "login_history"),
          orderBy("loginAtMs", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLogs(data);
      } catch (err) {
        console.error("Error cargando login_history:", err);
        setError("No se pudo cargar la auditoría.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="w-100" style={{ backgroundColor: "#f8f9fa" }}>
      <NavbarPage />

      <div className="container-fluid px-4 py-4">
        <h2 className="mb-4 fw-bold text-dark">Auditoría de Sesiones</h2>

        <div className="card shadow-lg border-0 rounded-4 p-4">
          <div className="table-responsive">
            {loading && <p>Cargando registros...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && logs.length === 0 && (
              <p>No existen registros de auditoría.</p>
            )}

            {!loading && !error && logs.length > 0 && (
              <table className="table table-hover align-middle custom-table">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Método</th>
                    <th>Fecha Entrada</th>
                    <th>Hora Entrada</th>
                    <th>Hora Salida</th>
                    <th>Duración (min)</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log, index) => (
                    <tr key={log.id}>
                      <td className="fw-bold">{index + 1}</td>
                      <td>{log.email || "-"}</td>
                      <td>
                        <span className="badge bg-primary">{log.provider}</span>
                      </td>
                      <td>{log.loginDate || "-"}</td>
                      <td>{log.loginTime || "-"}</td>
                      <td>{log.logoutTime || "-"}</td>
                      <td className="fw-semibold text-success">
                        {log.sessionDurationMinutes ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <FooterPage />
    </div>
  );
}

export default ListaAuditoria;
