import React, { useEffect, useState } from "react";
import NavbarPage from "../components/navbarPage";
import FooterPage from "../components/footerPage";

import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function ListaAuditoria() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [filterEmail, setFilterEmail] = useState("");
  const [filterProvider, setFilterProvider] = useState("Todos");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(
          collection(db, "login_history"),
          orderBy("loginAtMs", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((docSnap) => {
          const log = docSnap.data();

          // Determinar estado: Activo si NO tiene logoutTime
          const estado = log.logoutTime ? "Inactivo" : "Activo";

          return {
            id: docSnap.id,
            ...log,
            estado,
          };
        });

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

  // Obtener lista de métodos únicos para el select
  const providers = Array.from(
    new Set(logs.map((log) => log.provider).filter(Boolean))
  );

  // Aplicar filtros
  const filteredLogs = logs.filter((log) => {
    const emailMatch =
      filterEmail.trim() === "" ||
      (log.email || "").toLowerCase().includes(filterEmail.toLowerCase());

    const providerMatch =
      filterProvider === "Todos" || log.provider === filterProvider;

    return emailMatch && providerMatch;
  });

  return (
    <div className="w-100" style={{ backgroundColor: "#f8f9fa" }}>
      <NavbarPage />

      <div className="container-fluid px-4 py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
          <h2 className="mb-0 fw-bold text-dark text-wrap">
            Auditoría de Sesiones
          </h2>
          <small className="text-muted">
            Registros: {logs.length} sesión{logs.length !== 1 ? "es" : ""}
          </small>
        </div>

        <div className="card shadow-lg border-0 rounded-4 p-4">
          {/* ====== FILTROS BONITOS ====== */}
          <div className="mb-4">
            <h5 className="fw-semibold mb-3">BUSQUEDA</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Buscar por email
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: usuario@gmail.com"
                  value={filterEmail}
                  onChange={(e) => setFilterEmail(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Método de acceso
                </label>
                <select
                  className="form-select"
                  value={filterProvider}
                  onChange={(e) => setFilterProvider(e.target.value)}
                >
                  <option value="Todos">Todos</option>
                  {providers.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ====== TABLA ====== */}
          <div className="table-responsive">
            {loading && <p>Cargando registros...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && logs.length === 0 && (
              <p>No existen registros de auditoría.</p>
            )}

            {!loading && !error && logs.length > 0 && filteredLogs.length === 0 && (
              <p>No hay registros que coincidan con el filtro.</p>
            )}

            {!loading && !error && filteredLogs.length > 0 && (
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
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.map((log, index) => (
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

                      <td>
                        {log.estado === "Activo" ? (
                          <span className="badge bg-success">Activo</span>
                        ) : (
                          <span className="badge bg-secondary">Inactivo</span>
                        )}
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
