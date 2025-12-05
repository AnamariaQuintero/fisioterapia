import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function CitaPdf() {
  const [citas, setCitas] = useState([]);

  // Cargar todas las citas desde Firestore
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "citas"));
        const citasData = querySnapshot.docs.map((docSnap) => {
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
            id: docSnap.id,
            ...data,
            fecha,
            hora,
          };
        });

        setCitas(citasData);
      } catch (error) {
        console.error("Error obteniendo citas para PDF:", error);
      }
    };

    fetchCitas();
  }, []);

  // Cuando ya tenemos las citas, generamos el PDF automáticamente
  useEffect(() => {
    if (citas.length === 0) return;
    generarPdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citas]);

  const generarPdf = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    const fechaGeneracion = new Date().toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    });

    // ======= ENCABEZADO =======
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Centro de Fisioterapia", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(14);
    doc.text("Listado de Citas", pageWidth / 2, 25, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha de generación: ${fechaGeneracion}`, 14, 35);

    // ======= TABLA DE CITAS =======
    const body = citas.map((cita) => [
      cita.nombres || "",
      cita.apellido || "",
      cita.documento || "",
      cita.fecha || "",
      cita.hora || "",
      cita.estado ? "Activo" : "Inactivo",
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["Nombre", "Apellido", "Documento", "Fecha", "Hora", "Estado"]],
      body,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [220, 53, 69], // rojo tipo Bootstrap
        textColor: 255,
        halign: "center",
      },
      bodyStyles: {
        halign: "left",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // gris suave filas alternas
      },
      columnStyles: {
        2: { halign: "center" }, // documento
        3: { halign: "center" }, // fecha
        4: { halign: "center" }, // hora
        5: { halign: "center" }, // estado
      },
      margin: { top: 40, left: 14, right: 14, bottom: 20 },
    });

    const nombreArchivo = `citas_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;
    doc.save(nombreArchivo);
  };

  return (
    <div className="container p-4">
      <h2>Generando PDF de citas...</h2>
      <p>
        Si la descarga no inició automáticamente, haz clic en el siguiente
        botón:
      </p>
      <button className="btn btn-danger" onClick={generarPdf}>
        Descargar PDF
      </button>
    </div>
  );
}

export default CitaPdf;
