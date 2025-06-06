import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generarPDFComprobante = (datosCompra) => {
    return new Promise((resolve, reject) => {
        try {
            // Crear documento con tamaño A4
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50
            });
            const chunks = [];

            // Capturar el PDF en memoria
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // Colores corporativos
            const colors = {
                primary: '#272727',
                secondary: '#D65A31',
                text: '#333333',
                lightGray: '#666666'
            };

            // Encabezado
            doc.rect(0, 0, doc.page.width, 150)
               .fill(colors.primary);

            // Añadir logo
            try {
                const logoPath = join(__dirname, '../../../Frontend/src/assets/logo.png');
                console.log('Intentando cargar logo desde:', logoPath); // Debug
                
                if (fs.existsSync(logoPath)) {
                    doc.image(logoPath, 50, 30, {
                        width: 90,
                        height: 90,
                        align: 'left'
                    });
                } else {
                    console.error('El archivo del logo no existe en la ruta:', logoPath);
                }
            } catch (error) {
                console.error('Error al cargar el logo:', error);
                // Continuar sin el logo si hay error
            }

            // Logo texto (ahora más a la derecha para dejar espacio al logo)
            doc.fontSize(35)
               .fill('#ffffff')
               .text('GAMERS', doc.page.width / 2, 40)
               .fontSize(35)
               .fill(colors.secondary)
               .text('NEEDS', doc.page.width / 2 + 120, 40);

            // Línea decorativa
            doc.moveTo(50, 100)
               .lineTo(doc.page.width - 50, 100)
               .stroke(colors.secondary);

            // Título del documento
            doc.fontSize(16)
               .fill('#ffffff')
               .text('Comprobante de Compra', {
                   align: 'center',
                   y: 110
               });

            // Información de la compra
            doc.fill(colors.text)
               .fontSize(12)
               .text('Detalles de la Compra', 50, 180, {
                   underline: true,
                   fontSize: 14
               })
               .moveDown();

            // Cuadro de información
            const infoY = 210;
            doc.rect(50, infoY, doc.page.width - 100, 100)
               .lineWidth(1)
               .stroke(colors.lightGray);

            doc.fill(colors.text)
               .text(`Fecha: ${new Date(datosCompra.fecha).toLocaleString('es-ES')}`, 70, infoY + 20)
               .text(`Nº de Pedido: ${datosCompra.sessionId}`, 70, infoY + 40)
               .text(`Cliente: ${datosCompra.usuario.nombre}`, 70, infoY + 60)
               .text(`Email: ${datosCompra.usuario.email}`, 70, infoY + 80);

            // Tabla de productos
            const tableTop = 350;
            // Cabecera de la tabla
            doc.fill(colors.primary)
               .rect(50, tableTop, doc.page.width - 100, 30)
               .fill();

            doc.fill('#ffffff')
               .text('Producto', 70, tableTop + 10)
               .text('Precio', doc.page.width - 150, tableTop + 10);

            // Productos
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

            // Total
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
               .fontSize(10)
               .text('Gracias por confiar en', 
                     doc.page.width / 2 - 100, 
                     footerY, 
                     { align: 'center' });

            doc.fill(colors.primary)
               .fontSize(14)
               .text('GAMERS NEEDS', 
                     doc.page.width / 2 - 100, 
                     footerY + 20, 
                     { align: 'center' });

            // Línea decorativa final
            doc.moveTo(50, doc.page.height - 50)
               .lineTo(doc.page.width - 50, doc.page.height - 50)
               .stroke(colors.secondary);

            // Finalizar el documento
            doc.end();

        } catch (error) {
            console.error('Error generando PDF:', error);
            reject(error);
        }
    });
};