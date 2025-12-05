import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ReporteUsuariosPDF() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const usuariosData = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error obteniendo usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (usuarios.length === 0) return;
    generarPdf();
  }, [usuarios]);

  const generarPdf = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    const fechaGeneracion = new Date().toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    });

    // ENCABEZADO
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Centro de Fisioterapia", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(14);
    doc.text("Listado de Usuarios", pageWidth / 2, 25, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${fechaGeneracion}`, 14, 35);

    // TABLA CON COLOR LILA
    autoTable(doc, {
      startY: 40,
      head: [
        [
          "Nombre",
          "Apellidos",
          "Documento",
          "Nacimiento",
          "Género",
          "Teléfono",
          "Correo",
          "Dirección",
          "Estado",
        ],
      ],
      body: usuarios.map((u) => [
        u.nombre || "",
        u.apellidos || "",
        u.documento || "",
        u.fechaNacimiento || "",
        u.genero || "",
        u.telefono || "",
        u.correo || "",
        u.direccion || "",
        u.estadoCuenta || "",
      ]),

      styles: { fontSize: 9, cellPadding: 3 },

      // 💜 Encabezado lila claro
      headStyles: {
        fillColor: [200, 160, 240], // LILA CLARO
        textColor: [255, 255, 255],
        halign: "center",
      },

      alternateRowStyles: { fillColor: [245, 230, 255] },

      margin: { top: 40, left: 14, right: 14 },
    });

    doc.save(`usuarios_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="container p-4 text-center">

      <h2>Generando PDF de usuarios...</h2>
      <p>Si no inició automáticamente, haz clic en el botón:</p>

      <button
        className="px-4 py-2 fw-semibold"
        onClick={generarPdf}
        style={{
          backgroundColor: "#c8a0f0",
          border: "none",
          borderRadius: "6px",
          color: "white",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Descargar PDF
      </button>
    </div>
  );
}

export default ReporteUsuariosPDF;
