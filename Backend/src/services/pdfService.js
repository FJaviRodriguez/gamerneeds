import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generarPDFComprobante = (datosCompra) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50
            });
            const chunks = [];

            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // Colores corporativos
            const colors = {
                primary: '#272727',
                secondary: '#D65A31',
                text: '#333333',
                lightGray: '#666666',
                white: '#ffffff'
            };

            // Encabezado
            doc.rect(0, 0, doc.page.width, 150)
               .fill(colors.primary);

            // Logo texto con más separación
            const centerX = doc.page.width / 2;
            doc.fontSize(35);

            // GAMER y NEEDS más juntos y centrados (pero no demasiado)
            doc.fill(colors.white)
               .text('GAMER', centerX - 120, 35);

            // NEEDS con un poco más de separación
            doc.fill(colors.secondary)
               .text('NEEDS', centerX + 10, 35);

            // Factura centrada (mantenemos esta parte igual)
            doc.fontSize(16)
               .fill(colors.white)
               .text('Factura', centerX - 25, 90);

            // Línea decorativa
            doc.moveTo(50, 120)
               .lineTo(doc.page.width - 50, 120)
               .stroke(colors.secondary);

            // Detalles de la compra (con más espacio desde el encabezado)
            doc.fill(colors.text)
               .fontSize(14)
               .text('Detalles de la Compra', 50, 180)
               .moveDown();

            // Cuadro de información más grande
            const infoY = 220;
            doc.rect(50, infoY, doc.page.width - 100, 160) // Aumentado de 120 a 160
               .lineWidth(1)
               .stroke(colors.lightGray);

            // Información del cliente con mejor espaciado
            doc.fontSize(12)
               .fill(colors.text)
               .text(`Fecha: ${new Date(datosCompra.fecha).toLocaleString('es-ES')}`, 70, infoY + 20)
               .text(`Nº de Pedido:`, 70, infoY + 50)
               .text(`${datosCompra.sessionId}`, 70, infoY + 70, { // ID en línea separada
                   width: doc.page.width - 140,
                   align: 'left'
               })
               .text(`Cliente: ${datosCompra.usuario.nombre}`, 70, infoY + 100)
               .text(`Email: ${datosCompra.usuario.email}`, 70, infoY + 130);

            // Tabla de productos (ajustada hacia abajo)
            const tableTop = 420; // Ajustado para dar más espacio
            
            // Cabecera de la tabla
            doc.rect(50, tableTop, doc.page.width - 100, 30)
               .fill(colors.primary);

            doc.fill('#ffffff')
               .text('Producto', 70, tableTop + 10)
               .text('Precio', doc.page.width - 150, tableTop + 10);

            // Productos con mejor espaciado
            let yPos = tableTop + 40;
            datosCompra.items.forEach((item, index) => {
                const isEven = index % 2 === 0;
                if (isEven) {
                    doc.rect(50, yPos - 5, doc.page.width - 100, 30)
                       .fill('#f8f8f8');
                }
                
                doc.fill(colors.text)
                   .text(item.nombre, 70, yPos)
                   .text(`${item.precio}€`, doc.page.width - 150, yPos);
                
                yPos += 30;
            });

            // Total (ajustado según la última posición de los productos)
            const totalY = yPos + 20;
            doc.rect(doc.page.width - 200, totalY, 150, 40)
               .fill(colors.primary);

            doc.fill('#ffffff')
               .fontSize(14)
               .text(`Total: ${datosCompra.total}€`, 
                     doc.page.width - 180, 
                     totalY + 12);

            // Pie de página
            const footerY = doc.page.height - 100;
            doc.fill(colors.secondary)
               .fontSize(12) // Aumentado de 10 a 12
               .text('Gracias por confiar en', {
                   align: 'center',
                   width: doc.page.width,
                   y: footerY
               })
               .fontSize(14)
               .text('GAMERS NEEDS', {
                   align: 'center',
                   width: doc.page.width,
                   y: footerY + 20
               });

            // Línea decorativa final
            doc.moveTo(50, doc.page.height - 50)
               .lineTo(doc.page.width - 50, doc.page.height - 50)
               .stroke(colors.secondary);

            doc.end();

        } catch (error) {
            console.error('Error generando PDF:', error);
            reject(error);
        }
    });
};