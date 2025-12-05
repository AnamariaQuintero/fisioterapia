import React, { useState, useEffect } from "react";
import NavbarPage from "../components/navbarPage";
import FooterPage from "../components/footerPage";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

function ReadView() {
  const [citas, setCitas] = useState([]);
  const [editID, setEditID] = useState(null);
  const [formData, setFormData] = useState({
    nombres: "",
    apellido: "",
    documento: "",
    fecha: "",
    hora: "",
    estado: true,
  });
  const [ocupadas, setOcupadas] = useState(new Set()); // horas ocupadas para la fecha seleccionada
  const navigate = useNavigate();

  // Generar horarios 24h en bloques de 30 min (08:00-11:30, 14:00-17:30)
  const generarHorarios = () => {
    const horarios = [];
    const bloques = [
      { inicio: 8, fin: 12 }, // 08:00 - 12:00
      { inicio: 14, fin: 18 }, // 14:00 - 18:00
    ];

    bloques.forEach(({ inicio, fin }) => {
      for (let h = inicio; h < fin; h++) {
        horarios.push(`${String(h).padStart(2, "0")}:00`);
        horarios.push(`${String(h).padStart(2, "0")}:30`);
      }
    });

    return horarios;
  };

  // Cargar todas las citas (para la tabla)
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "citas"));
        const citasData = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();

          let fecha = "";
          if (data.fecha) {
            fecha =
              typeof data.fecha === "string"
                ? data.fecha
                : data.fecha.toDate().toISOString().split("T")[0];
          }

          let hora = "";
          if (data.hora) {
            hora =
              typeof data.hora === "string"
                ? data.hora
                : data.hora.toDate
                ? data.hora.toDate().toISOString().split("T")[1].substring(0, 5)
                : "";
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

  // Obtener horas ocupadas para una fecha dada (excluyendo la cita que se está editando)
  const fetchOcupadasPorFecha = async (fechaStr, excludeId = null) => {
    if (!fechaStr) {
      setOcupadas(new Set());
      return;
    }

    try {
      // rango desde 00:00 del día hasta 00:00 del siguiente día
      const start = new Date(`${fechaStr}T00:00:00`);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);

      const startTs = Timestamp.fromDate(start);
      const endTs = Timestamp.fromDate(end);

      const citasRef = collection(db, "citas");
      const q = query(citasRef, where("fecha", ">=", startTs), where("fecha", "<", endTs));
      const snapshot = await getDocs(q);

      const ocup = new Set();
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const id = docSnap.id;
        const horaVal = data.hora || "";
        if (id !== excludeId && horaVal) {
          ocup.add(horaVal);
        }
      });

      setOcupadas(ocup);
    } catch (error) {
      console.error("Error obteniendo horarios ocupados:", error);
      setOcupadas(new Set());
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const citaRef = doc(db, "citas", id);
      await updateDoc(citaRef, { estado: !estadoActual });
      setCitas((prevCitas) =>
        prevCitas.map((cita) => (cita.id === id ? { ...cita, estado: !estadoActual } : cita))
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      Swal.fire("❌ Error", "No se pudo cambiar el estado", "error");
    }
  };

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
          setCitas((prev) => prev.filter((cita) => cita.id !== id));
          Swal.fire("✅ Eliminado", "La cita fue eliminada", "success");
        } catch (error) {
          console.error("Error al eliminar cita:", error);
          Swal.fire("❌ Error", "No se pudo eliminar la cita", "error");
        }
      }
    });
  };

  // Iniciar edición inline
  const startEdit = (cita) => {
    setEditID(cita.id);
    setFormData({
      nombres: cita.nombres || "",
      apellido: cita.apellido || "",
      documento: cita.documento || "",
      fecha: cita.fecha || "",
      hora: cita.hora || "",
      estado: cita.estado ?? true,
    });

    // Cargar ocupadas para esa fecha, excluyendo la propia cita
    fetchOcupadasPorFecha(cita.fecha, cita.id);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(newData);

    // Si cambia la fecha, recargar horas ocupadas (excluyendo la cita que se edita)
    if (name === "fecha") {
      fetchOcupadasPorFecha(value, editID);
    }
  };

  // Guardar edición (verifica choque de horarios y redirige al listado)
  const saveEdit = async () => {
    if (!editID) return;

    // validaciones básicas
    if (!formData.fecha || !formData.hora) {
      return Swal.fire("⚠️ Datos incompletos", "La fecha y la hora son obligatorias", "warning");
    }

    try {
      // Construir Timestamp de la fecha+hora
      const fechaTimestamp = Timestamp.fromDate(new Date(`${formData.fecha}T${formData.hora}`));

      // Verificar si existe otra cita con el mismo timestamp (mismo slot) excluyendo la propia cita
      const citasRef = collection(db, "citas");
      const q = query(citasRef, where("fecha", "==", fechaTimestamp));
      const snapshot = await getDocs(q);

      let conflicto = false;
      snapshot.forEach((docSnap) => {
        if (docSnap.id !== editID) {
          conflicto = true;
        }
      });

      if (conflicto) {
        return Swal.fire("⚠️ Horario ocupado", "Ese horario ya está reservado. Elige otro.", "error");
      }

      // Si no hay conflicto, actualizar documento (guardando fecha como Timestamp y hora como string)
      const docRef = doc(db, "citas", editID);
      await updateDoc(docRef, {
        nombres: formData.nombres,
        apellido: formData.apellido,
        documento: formData.documento,
        fecha: fechaTimestamp,
        hora: formData.hora,
        estado: formData.estado,
        actualizado: new Date(),
      });

      // Actualizar estado local
      setCitas((prev) =>
        prev.map((cita) =>
          cita.id === editID ? { ...cita, nombres: formData.nombres, apellido: formData.apellido, documento: formData.documento, fecha: formData.fecha, hora: formData.hora, estado: formData.estado } : cita
        )
      );

      Swal.fire("✅ Éxito", "Cita actualizada correctamente", "success").then(() => {
        setEditID(null);
        // Redirigir al listado solicitado
        navigate("/CitaPage");
      });
    } catch (error) {
      console.error("Error al actualizar cita:", error);
      Swal.fire("❌ Error", "No se pudo actualizar la cita", "error");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarPage />

      <div className="flex-grow-1 p-4 bg-light mt-2">
        <div className="container-fluid h-100">
          <div className="card shadow-sm border-0 h-100 d-flex flex-column">
            <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
              <h2 className="mb-0 fw-bold text-dark">Lista de Citas</h2>
              <div className="d-flex justify-content-between">
                  <Link
                    to="/CitaPdf" className="btn btn-danger px-4 py-2 fw-semibold me-2"> + PDF
                  </Link>
                  <Link
                    to="/CitaExcel" className="btn btn-success px-4 py-2 fw-semibold me-2"> + EXCEL
                  </Link>
                  <Link
                    to="/CreateCita" className="btn btn-primary px-4 py-2 fw-semibold me-2"> + Nuevo registro
                  </Link>
                </div>
            </div>

            <div className="card-body p-0 flex-grow-1 overflow-auto">
              <table className="table table-hover mb-0">
                <thead className="sticky-top bg-light border-bottom">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Apellido</th>
                    <th className="px-4 py-3">N° Documento</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Hora</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.length > 0 ? (
                    citas.map((cita) => (
                      <React.Fragment key={cita.id}>
                        <tr>
                          <td className="px-4 py-3">{cita.nombres}</td>
                          <td className="px-4 py-3">{cita.apellido}</td>
                          <td className="px-4 py-3">{cita.documento}</td>
                          <td className="px-4 py-3">{cita.fecha}</td>
                          <td className="px-4 py-3">{cita.hora}</td>
                          <td className="px-4 py-3">
                            <button
                              className={`btn btn-sm fw-semibold ${cita.estado ? "btn-success" : "btn-danger"}`}
                              onClick={() => toggleEstado(cita.id, cita.estado)}
                            >
                              {cita.estado ? "Activado" : "Desactivado"}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <button className="btn btn-sm btn-warning fw-semibold" onClick={() => startEdit(cita)}>
                                Editar
                              </button>

                              <button className="btn btn-sm btn-danger fw-semibold" onClick={() => eliminarCita(cita.id)}>
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>

                        {editID === cita.id && (
                          <tr className="bg-light">
                            <td colSpan="7">
                              <div className="p-3">
                                <h5 className="fw-bold mb-3">Editar Cita</h5>
                                <div className="row g-3">
                                  <div className="col-md-4">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="nombres"
                                      value={formData.nombres}
                                      onChange={handleChange}
                                      placeholder="Nombres"
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="apellido"
                                      value={formData.apellido}
                                      onChange={handleChange}
                                      placeholder="Apellido"
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="documento"
                                      value={formData.documento}
                                      onChange={handleChange}
                                      placeholder="Documento"
                                    />
                                  </div>

                                  <div className="col-md-4">
                                    <input
                                      type="date"
                                      className="form-control"
                                      name="fecha"
                                      value={formData.fecha}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="col-md-4">
                                    <label className="form-label visually-hidden">Hora</label>
                                    <select
                                      className="form-control"
                                      name="hora"
                                      value={formData.hora}
                                      onChange={handleChange}
                                    >
                                      <option value="">Seleccione Hora</option>
                                      {generarHorarios().map((hora) => (
                                        <option key={hora} value={hora} disabled={ocupadas.has(hora) && hora !== (cita.hora || "")}>
                                          {hora}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="col-md-4 d-flex align-items-center">
                                    <label className="me-2">Estado</label>
                                    <input type="checkbox" name="estado" checked={formData.estado} onChange={handleChange} />
                                  </div>

                                  <div className="col-12 text-end mt-3">
                                    <button className="btn btn-success px-4 me-2" onClick={saveEdit}>
                                      Guardar
                                    </button>
                                    <button className="btn btn-secondary px-4" onClick={() => setEditID(null)}>
                                      Cancelar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No hay citas registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
