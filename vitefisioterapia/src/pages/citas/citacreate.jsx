import React, { useState } from "react";
import NavbarPage from "../components/navbarPage";
import FooterPage from "../components/footerPage";
import { db } from "../../firebase";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import "./styles.css";

function CreateView() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellido: "",
    documento: "",
    fecha: "",
    hora: "",
    estado: true,
  });

  // Generar horarios 24h en bloques de 30 min
  const generarHorarios = () => {
    const horarios = [];
    const bloques = [
      { inicio: 8, fin: 12 }, // 08:00 - 12:00
      { inicio: 14, fin: 18 } // 14:00 - 18:00
    ];

    bloques.forEach(({ inicio, fin }) => {
      for (let h = inicio; h < fin; h++) {
        horarios.push(`${String(h).padStart(2, "0")}:00`);
        horarios.push(`${String(h).padStart(2, "0")}:30`);
      }
    });

    return horarios;
  };

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Guardar cita en Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let fechaTimestamp = null;
      if (formData.fecha && formData.hora) {
        fechaTimestamp = Timestamp.fromDate(new Date(`${formData.fecha}T${formData.hora}`));
      }

      const citasRef = collection(db, "citas");
      const q = query(citasRef, where("fecha", "==", fechaTimestamp));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return Swal.fire("❗ Horario Ocupado", "Ya existe una cita en este horario. Elige otro.", "error");
      }

      await addDoc(collection(db, "citas"), {
        nombres: formData.nombres,
        apellido: formData.apellido,
        documento: formData.documento,
        fecha: fechaTimestamp,
        hora: formData.hora,
        estado: formData.estado,
        creado: new Date(),
      });

      Swal.fire("✅ Éxito", "La cita fue creada correctamente", "success");

      setFormData({
        nombres: "",
        apellido: "",
        documento: "",
        fecha: "",
        hora: "",
        estado: true,
      });
    } catch (error) {
      console.error("Error al guardar la cita:", error);
      Swal.fire("❌ Error", "Hubo un problema al guardar la cita", "error");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarPage />

      <main className="flex-grow-1 p-5 bg-light mb-5">
        <div className="container">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white border-0 py-4 px-4">
              <h2 className="mb-0 fw-bold text-dark">🗓 Crear Nueva Cita</h2>
            </div>

            <div className="card-body px-4 py-4">
              <form onSubmit={handleSubmit} className="row g-4">

                {/* Información Personal */}
                <div className="col-12">
                  <h5 className="text-secondary mb-3 pb-2 border-bottom">👤 Información del Paciente</h5>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Nombres</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    placeholder="Ej. Juan Carlos"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Apellidos</label>
                  <input
                    type="text"
                    className="form-control"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Ej. Pérez Gómez"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Documento</label>
                  <input
                    type="text"
                    className="form-control"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    placeholder="Número de identificación"
                    required
                  />
                </div>

                {/* Fecha y Hora */}
                <div className="col-12 mt-4">
                  <h5 className="text-secondary mb-3 pb-2 border-bottom">⏰ Fecha y Hora</h5>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Hora</label>
                  <select
                    className="form-select"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione Hora</option>
                    {generarHorarios().map((hora, index) => (
                      <option key={index} value={hora}>
                        {hora}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estado */}
                <div className="col-12 mt-4">
                  <h5 className="text-secondary mb-3 pb-2 border-bottom">⚙️ Estado</h5>
                </div>

                <div className="col-md-4 d-flex align-items-center">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="estadoSwitch"
                      name="estado"
                      checked={formData.estado}
                      onChange={handleChange}
                    />
                    <label className="form-check-label ms-2" htmlFor="estadoSwitch">
                      {formData.estado ? "Activado" : "Desactivado"}
                    </label>
                  </div>
                </div>

                {/* Botón Guardar */}
                <div className="col-12 text-center mt-4">
                  <button type="submit" className="btn btn-primary px-5 fw-semibold">
                    💾 Guardar Cita
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

export default CreateView;
  