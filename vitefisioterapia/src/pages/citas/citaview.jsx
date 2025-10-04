import React, { useState, useEffect } from "react";
import NavbarPage from "../components/navbarPage";
import FooterPage from "../components/footerPage";
import { Link } from "react-router-dom";
import { db } from "../../firebase"; 
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import "./styles.css";

function ReadView() {
  const [citas, setCitas] = useState([]);
    
  // 🔹 Cargar citas desde Firebase al montar el componente
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "citas"));
        const citasData = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();

          // ✅ Manejo de fecha
          let fecha = "";
          if (data.fecha) {
            if (typeof data.fecha === "string") {
              fecha = data.fecha; // ya es YYYY-MM-DD
            } else if (data.fecha.toDate) {
              fecha = data.fecha.toDate().toISOString().split("T")[0];
            }
          }

          // ✅ Manejo de hora
          let hora = "";
          if (data.hora) {
            if (typeof data.hora === "string") {
              hora = data.hora; // ya es HH:mm
            } else if (data.hora.toDate) {
              hora = data.hora.toDate().toISOString().split("T")[1].substring(0,5);
            }
          }

          return {
            id: docSnap.id,
            ...data,
            fecha,
            hora,
          };
        });

        setCitas(citasData);
      } catch (error) {
        console.error("Error obteniendo citas:", error);
        Swal.fire("❌ Error", "No se pudieron cargar las citas", "error");
      }
    };

    fetchCitas();
  }, []);

  // 🔹 Cambiar estado (true/false)
  const toggleEstado = async (id, estadoActual) => {
    try {
      const citaRef = doc(db, "citas", id);
      await updateDoc(citaRef, { estado: !estadoActual });

      setCitas((prevCitas) =>
        prevCitas.map((cita) =>
          cita.id === id ? { ...cita, estado: !estadoActual } : cita
        )
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      Swal.fire("❌ Error", "No se pudo cambiar el estado", "error");
    }
  };

  // 🔹 Eliminar cita
  const eliminarCita = async (id) => {
    Swal.fire({
      title: "¿Seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "citas", id));
          setCitas(citas.filter((cita) => cita.id !== id));
          Swal.fire("✅ Eliminado", "La cita fue eliminada", "success");
        } catch (error) {
          console.error("Error al eliminar cita:", error);
          Swal.fire("❌ Error", "No se pudo eliminar la cita", "error");
        }
      }
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarPage />

      <div className="flex-grow-1 p-4 bg-light">
        <div className="container-fluid h-100">
          <div className="card shadow-sm border-0 h-100 d-flex flex-column">
            <div className="card-header bg-white border-0 py-4 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0 fw-bold text-dark">Lista de Citas</h2>
                <Link
                  to="/CreateCita"
                  className="btn btn-primary px-4 py-2 fw-semibold"
                >
                  + Nueva Cita
                </Link>
              </div>
            </div>

            <div className="card-body p-0 flex-grow-1 overflow-auto">
              <div className="table-responsive h-100">
                <table className="table table-hover mb-0">
                  <thead className="sticky-top bg-light border-bottom">
                    <tr>
                      <th className="px-4 py-3">Nombres</th>
                      <th className="px-4 py-3">Apellido</th>
                      <th className="px-4 py-3">N° Documento</th>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Hora</th>
                      <th className="px-4 py-3">Duración</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citas.length > 0 ? (
                      citas.map((cita) => (
                        <tr key={cita.id} className="border-bottom">
                          <td className="px-4 py-3">{cita.nombres}</td>
                          <td className="px-4 py-3">{cita.apellido}</td>
                          <td className="px-4 py-3">{cita.documento}</td>
                          <td className="px-4 py-3">{cita.fecha}</td>
                          <td className="px-4 py-3">{cita.hora}</td>
                          <td className="px-4 py-3">{cita.duracion}</td>
                          <td className="px-4 py-3">
                            <button
                              className={`btn btn-sm fw-semibold ${
                                cita.estado ? "btn-success" : "btn-danger"
                              }`}
                              onClick={() => toggleEstado(cita.id, cita.estado)}
                            >
                              {cita.estado ? "Activado" : "Desactivado"}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="d-flex gap-2 justify-content-center">
                              <Link
                                to={`/EditCita/${cita.id}`}
                                className="btn btn-sm btn-warning fw-semibold"
                              >
                                Editar
                              </Link>
                              <button
                                className="btn btn-sm btn-danger fw-semibold"
                                onClick={() => eliminarCita(cita.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center py-4">
                          No hay citas registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-footer bg-white border-top py-3 px-4">
              <small className="text-muted">
                Mostrando {citas.length} cita{citas.length !== 1 ? "s" : ""}
              </small>
            </div>
          </div>
        </div>
      </div>

      <FooterPage />
    </div>
  );
}

export default ReadView;
