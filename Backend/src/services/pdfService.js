import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const generarPDFComprobante = async (datosCompra) => {
  const { sessionId, items, total, usuario, fecha } = datosCompra;
  
  // Crear directorio para PDFs si no existe
  const pdfDir = path.join(__dirname, '../../public/pdfs');
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  const doc = new PDFDocument();
  const pdfPath = path.join(pdfDir, `comprobante-${sessionId}.pdf`);
  const stream = fs.createWriteStream(pdfPath);

  return new Promise((resolve, reject) => {
    doc.pipe(stream);

    // Diseño del PDF
    doc.fontSize(20)
       .text('GAMERS NEEDS', { align: 'center' })
       .moveDown();

    doc.fontSize(16)
       .text('Comprobante de Compra', { align: 'center' })
       .moveDown();

    // Información de la compra
    doc.fontSize(12)
       .text(`Fecha: ${new Date(fecha).toLocaleString()}`)
       .text(`Nº de Pedido: ${sessionId}`)
       .text(`Cliente: ${usuario.nombre}`)
       .text(`Email: ${usuario.email}`)
       .moveDown();

    // Tabla de productos
    doc.text('Productos:', { underline: true })
       .moveDown();

    items.forEach(item => {
      doc.text(`${item.nombre} - ${item.precio}€`);
    });

    doc.moveDown()
       .text(`Total: ${total}€`, { align: 'right' });

    // Pie de página
    doc.fontSize(10)
       .text('Gracias por tu compra', { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve(pdfPath));
    stream.on('error', reject);
  });
};