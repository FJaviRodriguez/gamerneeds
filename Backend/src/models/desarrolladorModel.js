import pool from '../config/db.js';

export const crearDesarrollador = async (desarrollador) => {
  try {
    const { nombre, sitio_web, fecha_fundacion } = desarrollador;
    const [result] = await pool.query(
      'INSERT INTO desarrollador (nombre, sitio_web, fecha_fundacion) VALUES (?, ?, ?)',
      [nombre, sitio_web, fecha_fundacion]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error en crearDesarrollador:', error);
    throw error;
  }
};