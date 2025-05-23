import * as compraModel from '../models/compraModel.js';

export const mostrarCompraPorUsuario = async (req, res) => {
    try {
        const { usuario_idusuario } = req.params;
        const compras = await compraModel.mostrarCompraPorUsuario(usuario_idusuario);
        res.json(compras);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener compras', error: error.message });
    }
};
export const crearCompra = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); 
        const { usuario_id, juegos } = req.body;
        const total = juegos.reduce((sum, juego) => sum + juego.precio, 0);
        const idcompra = await compraModel.crearNuevaCompra(connection, usuario_id, total);
        await compraModel.aniadirJuegosACompra(connection, idcompra, juegos);
        await connection.commit();
        res.status(201).json({ 
            idcompra,
            mensaje: 'Compra creada exitosamente'
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error al crear la compra:', error);
        res.status(500).json({ mensaje: 'Error al procesar la compra' });
    } finally {
        connection.release();
    }
};
export const actualizarEstadoPago = async (req, res) => {
    try {
        const { idcompra, estado } = req.body;
        const actualizado = await compraModel.actualizarEstadoCompraPorId(idcompra, estado);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Compra no encontrada' });
        }
        res.json({ mensaje: 'Estado de pago actualizado' });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ mensaje: 'Error al actualizar estado de pago' });
    }
};
