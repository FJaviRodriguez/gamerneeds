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

export const crearGenero = async (genero) => {
  try {
    const { nombre, descripcion } = genero;
    const [result] = await pool.query(
      'INSERT INTO genero (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error en crearGenero:', error);
    throw error;
  }
};