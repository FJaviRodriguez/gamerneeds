import PDFDocument from 'pdfkit';

export const generarPDFComprobante = (datosCompra) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const chunks = [];

            // Capturar el PDF en memoria
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // Diseño del PDF
            doc.fontSize(20)
               .text('GAMERS NEEDS', { align: 'center' })
               .moveDown();

            doc.fontSize(16)
               .text('Comprobante de Compra', { align: 'center' })
               .moveDown();

            // Información de la compra
            doc.fontSize(12)
               .text(`Fecha: ${new Date(datosCompra.fecha).toLocaleString('es-ES')}`)
               .text(`Nº de Pedido: ${datosCompra.sessionId}`)
               .text(`Cliente: ${datosCompra.usuario.nombre}`)
               .text(`Email: ${datosCompra.usuario.email}`)
               .moveDown();

            // Lista de productos
            doc.text('Productos:', { underline: true })
               .moveDown();

            datosCompra.items.forEach(item => {
                doc.text(`${item.nombre} - ${item.precio}€`);
            });

            doc.moveDown()
               .text(`Total: ${datosCompra.total}€`, { align: 'right' })
               .moveDown()
               .fontSize(10)
               .text('Gracias por tu compra', { align: 'center' });

            // Finalizar el documento
            doc.end();

        } catch (error) {
            console.error('Error generando PDF:', error);
            reject(error);
        }
    });
};