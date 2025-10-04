import React, { useState } from "react";
import NavbarPage from "../components/navbarPage";
import FooterPage from "../components/footerPage";
import { db } from "../../firebase"; 
import { collection, addDoc, Timestamp } from "firebase/firestore"; // 🔹 usamos Timestamp
import Swal from "sweetalert2";
import "./styles.css";

function CreateView() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellido: "",
    documento: "",
    fecha: "",
    hora: "",
    duracion: "",
    estado: true,
  });

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
      // 🔹 Convertimos fecha + hora a un Timestamp
      let fechaTimestamp = null;
      if (formData.fecha && formData.hora) {
        fechaTimestamp = Timestamp.fromDate(new Date(`${formData.fecha}T${formData.hora}`));
      }

      // Guardamos en Firebase
      const docRef = await addDoc(collection(db, "citas"), {
        nombres: formData.nombres,
        apellido: formData.apellido,
        documento: formData.documento,
        fecha: fechaTimestamp, // 🔹 Fecha como Timestamp
        hora: formData.hora,   // 🔹 Hora como string
        duracion: formData.duracion,
        estado: formData.estado,
        creado: new Date(),
      });

      console.log("Cita guardada con ID:", docRef.id);
      Swal.fire("✅ Éxito", "La cita fue creada correctamente", "success");

      // Limpiar formulario
      setFormData({
        nombres: "",
        apellido: "",
        documento: "",
        fecha: "",
        hora: "",
        duracion: "",
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

      <main className="flex-grow-1 p-4 bg-light">
        <div className="container">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 py-4 px-4">
              <h2 className="mb-0 fw-bold text-dark">Crear Nueva Cita</h2>
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
                    className="btn btn-primary px-4 fw-semibold"
                  >
                    Guardar Cita
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
