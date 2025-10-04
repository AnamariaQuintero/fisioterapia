import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import NavbarPage from "../components/navbarPage";
import FooterPage from "../components/footerPage";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./styles.css";

function LeerUsuario() {
  const [usuarios, setUsuarios] = useState([]);

  // 🔹 Cargar usuarios desde Firebase al montar el componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const usuariosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        Swal.fire("❌ Error", "No se pudieron cargar los usuarios", "error");
      }
    };

    fetchUsuarios();
  }, []);

  // 🔹 Cambiar estado (Activo/Inactivo) en Firebase y actualizar en la UI
  const toggleEstadoUsuario = async (id, estadoActual) => {
    try {
      const usuarioRef = doc(db, "usuarios", id);
  
      // Cambia el estado entre "Activo" e "Inactivo"
      const nuevoEstado = estadoActual === "Activo" ? "Inactivo" : "Activo";
  
      await updateDoc(usuarioRef, { estadoCuenta: nuevoEstado });
  
      // Actualiza el estado local
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id === id ? { ...usuario, estadoCuenta: nuevoEstado } : usuario
        )
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      Swal.fire("❌ Error", "No se pudo cambiar el estado del usuario", "error");
    }
  };

  // 🔹 Eliminar usuario
  const eliminarUsuario = async (id) => {
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
          await deleteDoc(doc(db, "usuarios", id));
          setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
          Swal.fire("Eliminado", "El usuario fue eliminado", "success");
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
          Swal.fire(" Error", "No se pudo eliminar el usuario", "error");
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
                <h2 className="mb-0 fw-bold text-dark">Lista de Usuarios</h2>
                <Link
                  to="/CrearUsuario"
                  className="btn btn-primary px-4 py-2 fw-semibold"
                >
                  + Nuevo registro
                </Link>
              </div>
            </div>

            <div className="card-body p-0 flex-grow-1 overflow-auto">
              <div className="table-responsive h-100">
                <table className="table table-hover mb-0" style={{ minWidth: '1400px' }}>
                  <thead className="sticky-top bg-light border-bottom">
                    <tr>
                      <th className="px-4 py-3" style={{ minWidth: '120px' }}>Nombre</th>
                      <th className="px-4 py-3" style={{ minWidth: '120px' }}>Apellidos</th>
                      <th className="px-4 py-3" style={{ minWidth: '130px' }}>Documento</th>
                      <th className="px-4 py-3" style={{ minWidth: '140px' }}>Fecha Nacimiento</th>
                      <th className="px-4 py-3" style={{ minWidth: '110px' }}>Sexo/Género</th>
                      <th className="px-4 py-3" style={{ minWidth: '120px' }}>Teléfono</th>
                      <th className="px-4 py-3" style={{ minWidth: '180px' }}>Correo</th>
                      <th className="px-4 py-3" style={{ minWidth: '150px' }}>Dirección</th>
                      <th className="px-4 py-3" style={{ minWidth: '110px' }}>Estado</th>
                      <th className="px-4 py-3 text-center" style={{ minWidth: '180px' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length > 0 ? (
                      usuarios.map((usuario) => (
                        <tr key={usuario.id} className="border-bottom">
                          <td className="px-4 py-3">{usuario.nombre}</td>
                          <td className="px-4 py-3">{usuario.apellidos}</td>
                          <td className="px-4 py-3">{usuario.documento}</td>
                          <td className="px-4 py-3">{usuario.fechaNacimiento}</td>
                          <td className="px-4 py-3">{usuario.genero}</td>
                          <td className="px-4 py-3">{usuario.telefono}</td>
                          <td className="px-4 py-3">{usuario.correo}</td>
                          <td className="px-4 py-3">{usuario.direccion}</td>
                          <td className="px-4 py-3">
                          <button
                            className={`btn btn-sm fw-semibold ${
                                usuario.estadoCuenta === "Activo" ? "btn-success" : "btn-danger"
                            }`}
                            onClick={() => toggleEstadoUsuario(usuario.id, usuario.estadoCuenta)}
                            >
                            {usuario.estadoCuenta === "Activo" ? "Activado" : "Desactivado"}
                        </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="d-flex gap-2 justify-content-center">
                            <Link
                                to={`/EditarUsuario/${usuario.id}`}
                                className="btn btn-sm btn-warning fw-semibold"
                                >
                                Editar
                            </Link>
                              <button
                                className="btn btn-sm btn-danger fw-semibold"
                                onClick={() => eliminarUsuario(usuario.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center py-4">
                          No hay usuarios registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-footer bg-white border-top py-3 px-4">
              <small className="text-muted">
                Mostrando {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''}
              </small>
            </div>
          </div>
        </div>
      </div>

      <FooterPage />
    </div>
  );
}

export default LeerUsuario;