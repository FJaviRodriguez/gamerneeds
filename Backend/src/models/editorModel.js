import pool from '../config/db.js';

export const crearEditor = async (editor) => {
  try {
    const { nombre, sitio_web, fecha_fundacion } = editor;
    const [result] = await pool.query(
      'INSERT INTO editor (nombre, sitio_web, fecha_fundacion) VALUES (?, ?, ?)',
      [nombre, sitio_web, fecha_fundacion]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error en crearEditor:', error);
    throw error;
  }
};

export const mostrarEditores = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM editor ORDER BY nombre');
    return rows;
  } catch (error) {
    console.error('Error al mostrar editores:', error);
    throw error;
  }
};