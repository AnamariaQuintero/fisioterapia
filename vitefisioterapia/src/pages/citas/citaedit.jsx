import React, { useState, useEffect } from "react";
import NavbarPage from "../components/navbarPage";
import FooterPage from "../components/footerPage";
import { db } from "../../firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import "./styles.css";
import { useParams, useNavigate } from "react-router-dom";

function EditView() {
  const { id } = useParams(); // <- ID de la cita desde la ruta
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: "",
    apellido: "",
    documento: "",
    fecha: "",
    hora: "",
    duracion: "",
    estado: true,
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Cargar datos actuales de la cita
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "citas", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // ✅ Convertir fecha y hora si vienen como Timestamp
          let fecha = "";
          if (data.fecha) {
            if (typeof data.fecha === "string") {
              fecha = data.fecha;
            } else if (data.fecha.toDate) {
              fecha = data.fecha.toDate().toISOString().split("T")[0];
            }
          }

          let hora = "";
          if (data.hora) {
            if (typeof data.hora === "string") {
              hora = data.hora;
            } else if (data.hora.toDate) {
              hora = data.hora.toDate().toISOString().split("T")[1].substring(0, 5);
            }
          }

          setFormData({
            nombres: data.nombres || "",
            apellido: data.apellido || "",
            documento: data.documento || "",
            fecha,
            hora,
            duracion: data.duracion || "",
            estado: data.estado ?? true,
          });
        } else {
          Swal.fire("❌ Error", "La cita no existe", "error");
          navigate("/"); 
        }
      } catch (error) {
        console.error("Error al cargar cita:", error);
        Swal.fire("❌ Error", "No se pudo cargar la cita", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 Actualizar cita
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "citas", id);
      await updateDoc(docRef, {
        ...formData,
        actualizado: new Date(),
      });

      Swal.fire("✅ Éxito", "La cita fue actualizada correctamente", "success");
      navigate("/CitaPage"); 
    } catch (error) {
      console.error("Error al actualizar cita:", error);
      Swal.fire("❌ Error", "Hubo un problema al actualizar la cita", "error");
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <NavbarPage />
        <main className="flex-grow-1 d-flex align-items-center justify-content-center">
          <h4>Cargando datos de la cita...</h4>
        </main>
        <FooterPage />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarPage />

      <main className="flex-grow-1 p-4 bg-light">
        <div className="container">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 py-4 px-4">
              <h2 className="mb-0 fw-bold text-dark">Editar Cita</h2>
            </div>

            <div className="card-body px-4">
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-5">
                  <label className="form-label">Nombres</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-5">
                  <label className="form-label">Apellido</label>
                  <input
                    type="text"
                    className="form-control"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Número de Documento</label>
                  <input
                    type="text"
                    className="form-control"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Hora</label>
                  <input
                    type="time"
                    className="form-control"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Duración</label>
                  <input
                    type="text"
                    className="form-control"
                    name="duracion"
                    placeholder="Ej: 45 min"
                    value={formData.duracion}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 d-flex align-items-center">
                  <label className="form-label me-3">Estado</label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="estadoSwitch"
                      name="estado"
                      checked={formData.estado}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="estadoSwitch">
                      {formData.estado ? "Activado" : "Desactivado"}
                    </label>
                  </div>
                </div>

                <div className="col-12 text-end">
                  <button
                    type="submit"
                    className="btn btn-warning px-4 fw-semibold"
                  >
                    Actualizar Cita
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <FooterPage />
    </div>
  );
}

export default EditView;
