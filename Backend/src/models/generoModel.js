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

export const eliminarGenero = async (idgenero) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Primero eliminar las relaciones
    await connection.query(
      'DELETE FROM juego_has_genero WHERE genero_idgenero = ?',
      [idgenero]
    );

    // Luego eliminar el género
    await connection.query('DELETE FROM genero WHERE idgenero = ?', [
      idgenero,
    ]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};