import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- usado para navegar
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import NavbarPage from "../components/navbarPage";
import FooterPage from "../components/footerPage";
import "./styles.css";

function CrearUsuario() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    documento: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    correo: "",
    direccion: "",
    estadoCuenta: "Activo",
  });

  const [errors, setErrors] = useState({});
  const cardRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validaciones (tu lógica existente)
  const validateFields = () => {
    let newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,50}$/.test(formData.nombre)) {
      newErrors.nombre = "El nombre solo debe contener letras (2-50 caracteres)";
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son obligatorios";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,50}$/.test(formData.apellidos)) {
      newErrors.apellidos = "Los apellidos solo deben contener letras (2-50 caracteres)";
    }

    if (!formData.documento.trim()) {
      newErrors.documento = "El documento es obligatorio";
    } else if (!/^[0-9]{6,15}$/.test(formData.documento)) {
      newErrors.documento = "Debe tener entre 6 y 15 dígitos numéricos";
    }

    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria";
    } else {
      const fecha = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fecha.getFullYear();
      const m = hoy.getMonth() - fecha.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) edad--;
      if (edad < 18) newErrors.fechaNacimiento = "El usuario debe ser mayor de edad";
    }

    if (!formData.genero) newErrors.genero = "Debe seleccionar un género";

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!/^[0-9]{7,15}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener entre 7 y 15 dígitos";
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "Formato de correo inválido";
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria";
    } else if (formData.direccion.length < 5) {
      newErrors.direccion = "La dirección es demasiado corta";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return Swal.fire("Error", "Por favor corrige los errores", "error");
    }

    try {
      const docRef = await addDoc(collection(db, "usuarios"), {
        ...formData,
        creado: new Date(),
      });

      console.log("Usuario guardado con ID:", docRef.id);

      // esperamos a que el modal se muestre y se cierre
      await Swal.fire("Éxito", "Usuario creado correctamente", "success");

      // <-- Navegar a la lista.
      navigate("/LeerUsuario");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      Swal.fire("Error", "No se pudo crear el usuario", "error");
    }
  };

  // Efecto visual (igual que antes)
  useEffect(() => {
    const updateAmbientLight = (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const angleX = (x - centerX) / centerX;
      const angleY = (y - centerY) / centerY;
      const shadowX = angleX * 30;
      const shadowY = angleY * 30;
      cardRef.current.style.boxShadow = `
        ${shadowX}px ${shadowY}px 50px rgba(190,195,207,0.4),
        ${-shadowX}px ${-shadowY}px 50px rgba(255,255,255,0.8)
      `;
    };
    document.addEventListener("mousemove", updateAmbientLight);
    return () => document.removeEventListener("mousemove", updateAmbientLight);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <NavbarPage />

      <main className="flex-grow-1 p-4 d-flex justify-content-center align-items-start">
        <div className="container-fluid d-flex justify-content-center">
          <div
            className="card shadow-sm border-0 p-4 mb-4"
            style={{
              maxWidth: "700px",
              width: "100%",
              borderRadius: "20px",
              background: "white",
            }}
            ref={cardRef}
          >
            <h2 className="fw-bold mb-4 text-center text-dark">Crear Usuario</h2>
            <form onSubmit={handleSubmit} className="row g-3">
              {/* Nombre */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Nombre</label>
                <input
                  type="text"
                  className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>

              {/* Apellidos */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Apellidos</label>
                <input
                  type="text"
                  className={`form-control ${errors.apellidos ? "is-invalid" : ""}`}
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                />
                {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
              </div>

              {/* Documento */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Documento de identidad</label>
                <input
                  type="text"
                  className={`form-control ${errors.documento ? "is-invalid" : ""}`}
                  name="documento"
                  value={formData.documento}
                  onChange={handleInputChange}
                />
                {errors.documento && <div className="invalid-feedback">{errors.documento}</div>}
              </div>

              {/* Fecha de nacimiento */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Fecha de nacimiento</label>
                <input
                  type="date"
                  className={`form-control ${errors.fechaNacimiento ? "is-invalid" : ""}`}
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                />
                {errors.fechaNacimiento && <div className="invalid-feedback">{errors.fechaNacimiento}</div>}
              </div>

              {/* Género */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Sexo / Género</label>
                <select
                  className={`form-select ${errors.genero ? "is-invalid" : ""}`}
                  name="genero"
                  value={formData.genero}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
                {errors.genero && <div className="invalid-feedback">{errors.genero}</div>}
              </div>

              {/* Teléfono */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Teléfono</label>
                <input
                  type="text"
                  className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
                {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
              </div>

              {/* Correo */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Correo electrónico</label>
                <input
                  type="email"
                  className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                />
                {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
              </div>

              {/* Dirección */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Dirección</label>
                <input
                  type="text"
                  className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
                {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
              </div>

              {/* Estado */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Estado de la cuenta</label>
                <select
                  className="form-select"
                  name="estadoCuenta"
                  value={formData.estadoCuenta}
                  onChange={handleInputChange}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              {/* Botón */}
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100 fw-semibold py-2 mt-3">
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <FooterPage />
    </div>
  );
}

export default CrearUsuario;
