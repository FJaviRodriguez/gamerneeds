import pool from '../config/db.js';

export const mostrarGeneros = async () => {
  try {
    const [generos] = await pool.query('SELECT * FROM genero ORDER BY nombre');
    return generos;
  } catch (error) {
    console.error('Error en mostrarGeneros:', error);
    throw error;
  }
};