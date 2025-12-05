// src/pages/citas/CitaExcel.jsx (ajusta la ruta según tu estructura)

import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";

function CitaExcel() {
  const [citas, setCitas] = useState([]);

  // Cargar todas las citas desde Firestore
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const snapshot = await getDocs(collection(db, "citas"));

        const citasData = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();

          // Normalizar fecha
          let fecha = "";
          if (data.fecha) {
            fecha =
              typeof data.fecha === "string"
                ? data.fecha
                : data.fecha.toDate().toISOString().split("T")[0];
          }

          // Normalizar hora
          let hora = "";
          if (data.hora) {
            hora =
              typeof data.hora === "string"
                ? data.hora
                : data.hora.toDate
                ? data.hora
                    .toDate()
                    .toISOString()
                    .split("T")[1]
                    .substring(0, 5)
                : "";
          }

          return {
            nombres: data.nombres || "",
            apellido: data.apellido || "",
            documento: data.documento || "",
            fecha,
            hora,
            estado: data.estado ? "Activo" : "Inactivo",
          };
        });

        setCitas(citasData);
      } catch (error) {
        console.error("Error obteniendo citas para Excel:", error);
      }
    };

    fetchCitas();
  }, []);

  // Cuando ya tenemos las citas, generamos el Excel automáticamente
  useEffect(() => {
    if (citas.length === 0) return;
    generarExcel();
  }, [citas]);

  const generarExcel = () => {
    const fechaGeneracion = new Date().toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    });

    // ======= ARMAR LOS DATOS PARA EL EXCEL (AOA: Array of Arrays) =======
    const data = [];

    // Título
    data.push(["Listado de Citas"]);
    // Fila fecha de generación
    data.push([`Fecha de generación: ${fechaGeneracion}`]);
    // Fila en blanco
    data.push([]);
    // Encabezados de tabla
    data.push([
      "Nombre",
      "Apellido",
      "Documento",
      "Fecha",
      "Hora",
      "Estado",
    ]);

    // Filas de citas
    citas.forEach((cita) => {
      data.push([
        cita.nombres,
        cita.apellido,
        cita.documento,
        cita.fecha,
        cita.hora,
        cita.estado,
      ]);
    });

    // Crear hoja
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Ajustar anchos de columnas
    worksheet["!cols"] = [
      { wch: 20 }, // Nombre
      { wch: 20 }, // Apellido
      { wch: 18 }, // Documento
      { wch: 12 }, // Fecha
      { wch: 10 }, // Hora
      { wch: 10 }, // Estado
    ];

    // Crear libro y agregar hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Citas");

    // Nombre del archivo
    const fileName = `citas_${new Date().toISOString().slice(0, 10)}.xlsx`;

    // Descargar archivo
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="container p-4">
      <h2>Generando Excel de citas...</h2>
      <p>
        Si la descarga no inició automáticamente, haz clic en el siguiente
        botón:
      </p>
      <button className="btn btn-success" onClick={generarExcel}>
        Descargar Excel
      </button>
    </div>
  );
}

export default CitaExcel;
