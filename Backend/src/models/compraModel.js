import pool from '../config/db.js';

export const crearCompra = async (usuarioId, total) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const [result] = await connection.query(
            'INSERT INTO compra (usuario_idusuario, total, fecha_compra) VALUES (?, ?, NOW())',
            [usuarioId, total]
        );
        
        await connection.commit();
        return result.insertId;
    } catch (error) {
        await connection.rollback();
        console.error('Error en crearCompra:', error);
        throw error;
    } finally {
        connection.release();
    }
};
export const aniadirJuegosACompra = async (connection, idcompra, juegos) => {
    for (const juego of juegos) {
        await connection.query(
            'INSERT INTO compra_has_juego (compra_idcompra, juego_idjuego, precio_unitario) VALUES (?, ?, ?)',
            [idcompra, juego.idjuego, juego.precio]
        );
    }
};
export const mostrarCompraPorUsuario = async (usuario_idusuario) => {
    const [compras] = await pool.query(
        'SELECT c.*, j.titulo, chj.precio_unitario FROM compra c ' +
        'LEFT JOIN compra_has_juego chj ON c.idcompra = chj.compra_idcompra ' +
        'LEFT JOIN juego j ON chj.juego_idjuego = j.idjuego ' +
        'WHERE c.usuario_idusuario = ?',
        [usuario_idusuario]
    );
    return compras;
};
export const actualizarEstadoCompraPorId = async (idcompra, estado) => {
    const [result] = await pool.query(
        'UPDATE compra SET estado_pago = ? WHERE idcompra = ?',
        [estado, idcompra]
    );
    return result.affectedRows > 0;

};
