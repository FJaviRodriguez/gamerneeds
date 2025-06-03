import pool from '../config/db.js';

export const mostrarBiblioteca = async (usuarioId) => {
    if (!usuarioId) {
        throw new Error('ID de usuario no proporcionado');
    }

    try {
        const [juegos] = await pool.query(`
            SELECT 
                j.*,
                b.fecha_adquisicion
            FROM biblioteca b
            INNER JOIN juego j ON b.juego_idjuego = j.idjuego
            WHERE b.usuario_idusuario = ?
            ORDER BY b.fecha_adquisicion DESC
        `, [usuarioId]);

        return juegos.map(juego => ({
            ...juego,
            url_portada: juego.url_portada 
                ? `${process.env.BACKEND_URL}/public/juegos/${juego.url_portada}`
                : '/icons/default-game.png'
        }));
    } catch (error) {
        console.error('Error en mostrarBiblioteca:', error);
        throw new Error('Error al obtener la biblioteca del usuario');
    }
};
export const aniadirJuegosABiblioteca = async (usuarioId, juegosIds) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        for (const juegoId of juegosIds) {
            await connection.query(
                `INSERT INTO biblioteca (usuario_idusuario, juego_idjuego, fecha_adquisicion) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE fecha_adquisicion = ?`,
                [usuarioId, juegoId, fecha, fecha]
            );
        }
        
        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        console.error('Error en aniadirJuegosABiblioteca:', error);
        throw error;
    } finally {
        connection.release();
    }
};
export const mostrarHistorialJuegos = async (usuarioId) => {
  try {
    const [juegos] = await pool.query(`
      SELECT 
        j.idjuego,
        j.titulo,
        j.precio,
        j.url_portada,
        b.fecha_adquisicion
      FROM biblioteca b
      INNER JOIN juego j ON b.juego_idjuego = j.idjuego
      WHERE b.usuario_idusuario = ?
      ORDER BY b.fecha_adquisicion DESC`, [usuarioId]);
    return juegos.map(juego => ({
      ...juego,
      url_portada: juego.url_portada 
        ? `${process.env.BACKEND_URL}/public/juegos/${juego.url_portada}`
        : '/icons/default-game.png'
    }));
  } catch (error) {
    throw new Error('Error al obtener el historial de juegos');
  }
};