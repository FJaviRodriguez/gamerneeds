import pool from '../config/db.js';

export const mostrarGeneros = async () => {
    const [generos] = await pool.query(`
        SELECT idgenero, nombre, descripcion
        FROM genero
        ORDER BY nombre`);
    return generos;
};