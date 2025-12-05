📄Exportación a PDF y Excel — Implementación

Este documento explica de forma precisa cómo fue implementada la exportación de datos a PDF y Excel en el proyecto.
Se aplica tanto al módulo de Usuarios como al de Citas, ya que ambos usan la misma estructura y lógica de exportación.

✅ Tecnologías utilizadas
Para PDF
jspdf
jspdf-autotable

Para Excel
xlsx

📦 Instalación de dependencias
npm install jspdf jspdf-autotable
npm install xlsx file-saver

Exportación a PDF — Implementación

La exportación a PDF se realiza utilizando jsPDF para crear el archivo y autoTable para renderizar la tabla con datos obtenidos desde Firebase.

🔧 Código base utilizado
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDF = (data, titulo) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(titulo, 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [Object.keys(data[0])],
    body: data.map(item => Object.values(item)),
  });

  doc.save(`${titulo}.pdf`);
};

🔁 Cómo se integra en el proyecto

Los datos vienen de Firebase:

const usuariosData = querySnapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data()
}));


Luego se pasa la data al generador:

generarPDF(usuariosData, "Reporte de Usuarios");


En la UI, un botón redirige a una ruta que ejecuta esta función:

<Link to="/ReporteUsuariosPDF" className="btn btn-danger">
  + PDF
</Link>

📗 Exportación a Excel — Implementación

Para Excel se usa XLSX para crear el archivo y FileSaver para descargarlo.

🔧 Código base utilizado
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const generarExcel = (data, nombreArchivo) => {
  const hoja = XLSX.utils.json_to_sheet(data);
  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(libro, hoja, "Datos");
  const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });

  const archivo = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(archivo, `${nombreArchivo}.xlsx`);
};

🔁 Integración en el proyecto

La data también viene desde Firestore:

generarExcel(usuariosData, "Reporte_Usuarios");


Los botones activan la exportación:

<Link to="/ReporteUsuariosEXCEL" className="btn btn-success">
  + Excel
</Link>