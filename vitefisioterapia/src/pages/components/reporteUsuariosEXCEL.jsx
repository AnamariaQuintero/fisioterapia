import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";

function ReporteUsuariosEXCEL() {
  const [usuarios, setUsuarios] = useState([]);

  // Cargar usuarios desde Firestore
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const snapshot = await getDocs(collection(db, "usuarios"));

        const usuariosData = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error obteniendo usuarios para Excel:", error);
      }
    };

    fetchUsuarios();
  }, []);

  // Crear el Excel cuando los datos cargan
  useEffect(() => {
    if (usuarios.length > 0) {
      generarExcel();
    }
  }, [usuarios]);

  const generarExcel = () => {
    const fechaGeneracion = new Date().toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const data = [];

    // Encabezado del reporte
    data.push(["Reporte de Usuarios"]);
    data.push([`Fecha de generación: ${fechaGeneracion}`]);
    data.push([]);

    // Encabezados de la tabla
    data.push([
      "Nombre",
      "Apellidos",
      "Documento",
      "Fecha Nacimiento",
      "Género",
      "Teléfono",
      "Correo",
      "Dirección",
      "Estado",
    ]);

    // Filas
    usuarios.forEach((u) => {
      data.push([
        u.nombre || "",
        u.apellidos || "",
        u.documento || "",
        u.fechaNacimiento || "",
        u.genero || "",
        u.telefono || "",
        u.correo || "",
        u.direccion || "",
        u.estadoCuenta || "",
      ]);
    });

    // Crear hoja de Excel
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Ajustar anchos de columna
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 14 },
      { wch: 25 },
      { wch: 22 },
      { wch: 12 },
    ];

    // Crear libro y descargar
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

    const fileName = `usuarios_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="container p-4">
      <h2>Generando Excel de usuarios...</h2>
      <p>Si no inició la descarga automáticamente, haz clic aquí:</p>

      <button
        style={{
          backgroundColor: "#C79BFF",
          color: "white",
          padding: "10px 18px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#B57AFF")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#C79BFF")}
        onClick={generarExcel}
      >
        Descargar Excel
      </button>
    </div>
  );
}

export default ReporteUsuariosEXCEL;
