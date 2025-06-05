import pool from '../config/db.js';

export const mostrarGeneros = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM genero ORDER BY nombre');
    return rows;
  } catch (error) {
    console.error('Error al mostrar géneros:', error);
    throw error;
  }
};