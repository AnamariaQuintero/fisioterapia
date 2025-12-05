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
        Swal.fire("❌ Error", "No se pudieron cargar los usuarios", "error");
      }
    };
    fetchUsuarios();
  }, []);

  const toggleEstadoUsuario = async (id, estadoActual) => {
    try {
      const usuarioRef = doc(db, "usuarios", id);
      const nuevoEstado = estadoActual === "Activo" ? "Inactivo" : "Activo";
      await updateDoc(usuarioRef, { estadoCuenta: nuevoEstado });

      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === id ? { ...usuario, estadoCuenta: nuevoEstado } : usuario
        )
      );
    } catch (error) {
      Swal.fire("❌ Error", "No se pudo cambiar el estado del usuario", "error");
    }
  };

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
          setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
          Swal.fire("Eliminado", "El usuario fue eliminado", "success");
        } catch (error) {
          Swal.fire("❌ Error", "No se pudo eliminar el usuario", "error");
        }
      }
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarPage />

      <div className="flex-grow-1 p-2 p-md-4 bg-light">
        <div className="container-fluid">

          <div className="card shadow-sm border-0">

            {/* HEADER */}
            <div className="card-header bg-white border-0 py-3">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <h2 className="mb-0 fw-bold text-dark">Lista de Usuarios</h2>

                <div className="d-flex flex-wrap gap-2">
                  <Link to="/ReporteUsuariosPDF" className="btn btn-danger fw-semibold btn-responsive">
                    + PDF
                  </Link>
                  <Link to="/ReporteUsuariosEXCEL" className="btn btn-success fw-semibold btn-responsive">
                    + EXCEL
                  </Link>
                  <Link to="/CrearUsuario" className="btn btn-primary fw-semibold btn-responsive">
                    + Nuevo registro
                  </Link>
                </div>
              </div>
            </div>

            {/* TABLA RESPONSIVE */}
            <div className="card-body p-0">
              <div className="table-wrapper">
                <table className="table table-hover mb-0 usuarios-table">
                  <thead className="bg-purple text-white">
                    <tr>
                      <th>Nombre</th>
                      <th>Apellidos</th>
                      <th>Documento</th>
                      <th>Fecha Nacimiento</th>
                      <th>Sexo/Género</th>
                      <th>Teléfono</th>
                      <th>Correo</th>
                      <th>Dirección</th>
                      <th>Estado</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usuarios.length > 0 ? (
                      usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>{usuario.nombre}</td>
                          <td>{usuario.apellidos}</td>
                          <td>{usuario.documento}</td>
                          <td>{usuario.fechaNacimiento}</td>
                          <td>{usuario.genero}</td>
                          <td>{usuario.telefono}</td>
                          <td>{usuario.correo}</td>
                          <td>{usuario.direccion}</td>

                          <td>
                            <button
                              className={`btn btn-sm fw-semibold rounded-pill w-100 ${
                                usuario.estadoCuenta === "Activo"
                                  ? "btn-success"
                                  : "btn-danger"
                              }`}
                              onClick={() =>
                                toggleEstadoUsuario(usuario.id, usuario.estadoCuenta)
                              }
                            >
                              {usuario.estadoCuenta}
                            </button>
                          </td>

                          <td className="text-center">
                            <div className="d-flex flex-column gap-2 w-100 justify-content-center align-items-center">
                              <Link
                                to={`/EditarUsuario/${usuario.id}`}
                                className="btn btn-warning btn-sm rounded-pill fw-semibold w-100"
                              >
                                Editar
                              </Link>

                              <button
                                className="btn btn-danger btn-sm rounded-pill fw-semibold w-100"
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
                        <td colSpan="10" className="text-center py-4 text-muted">
                          No hay usuarios registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-footer bg-white border-top py-3 px-3">
              <small className="text-muted">
                Mostrando {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""}
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
