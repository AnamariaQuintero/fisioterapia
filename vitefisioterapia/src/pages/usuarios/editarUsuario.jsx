import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import NavbarPage from "../components/navbarPage";
import FooterPage from "../components/footerPage";

function EditarUsuario() {
  const { id } = useParams(); // 🔹 Capturamos el ID de la URL
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

  const [loading, setLoading] = useState(true);

  // 🔹 Cargar datos del usuario al iniciar
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const usuarioRef = doc(db, "usuarios", id);
        const usuarioSnap = await getDoc(usuarioRef);

        if (usuarioSnap.exists()) {
          setFormData(usuarioSnap.data());
        } else {
          Swal.fire("Error", "El usuario no existe", "error");
          navigate("/LeerUsuario");
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        Swal.fire("Error", "No se pudo cargar el usuario", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id, navigate]);

  // 🔹 Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuarioRef = doc(db, "usuarios", id);
      await updateDoc(usuarioRef, formData);
      Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      navigate("/leerusuario");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-light justify-content-center align-items-center">
        <h3>Cargando usuario...</h3>
      </div>
    );
  }

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
          >
            <h2 className="fw-bold mb-4 text-center text-dark">
              Editar Usuario
            </h2>

            <form onSubmit={handleSubmit} className="row g-3">
              {/* Nombre */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>

              {/* Apellidos */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Apellidos</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                />
              </div>

              {/* Documento */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Documento</label>
                <input
                  type="text"
                  className="form-control"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                />
              </div>

              {/* Fecha de nacimiento */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                />
              </div>

              {/* Género */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Sexo / Género</label>
                <select
                  className="form-select"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                >
                  <option value="">Seleccione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              {/* Teléfono */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>

              {/* Correo */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>

              {/* Dirección */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </div>

              {/* Estado */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Estado de cuenta</label>
                <select
                  className="form-select"
                  name="estadoCuenta"
                  value={formData.estadoCuenta}
                  onChange={handleChange}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              {/* Botón Guardar */}
              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-semibold py-2 mt-3"
                >
                  Guardar Cambios
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

export default EditarUsuario;
