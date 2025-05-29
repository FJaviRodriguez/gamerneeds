import pool from '../config/db.js';

export const mostrarJuegos = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        juego.*,
        GROUP_CONCAT(DISTINCT desarrollador.nombre) AS desarrollador,
        GROUP_CONCAT(DISTINCT editor.nombre) AS editor,
        GROUP_CONCAT(DISTINCT genero.nombre) AS generos
      FROM juego
      LEFT JOIN juego_has_desarrollador ON juego.idjuego = juego_has_desarrollador.juego_idjuego
      LEFT JOIN desarrollador ON juego_has_desarrollador.desarrollador_iddesarrollador = desarrollador.iddesarrollador
      LEFT JOIN editor_has_juego ON juego.idjuego = editor_has_juego.juego_idjuego
      LEFT JOIN editor ON editor_has_juego.editor_ideditor = editor.ideditor
      LEFT JOIN juego_has_genero ON juego.idjuego = juego_has_genero.juego_idjuego
      LEFT JOIN genero ON juego_has_genero.genero_idgenero = genero.idgenero
      GROUP BY juego.idjuego`);

    return rows.map(juego => ({
      ...juego,
      url_portada: juego.url_portada 
        ? `${process.env.BACKEND_URL}/public/juegos/${juego.url_portada}`
        : '/icons/default-game.png',
      desarrollador: juego.desarrollador?.split(',')[0] || 'No especificado',
      editor: juego.editor?.split(',')[0] || 'No especificado',
      generos: juego.generos ? juego.generos.split(',') : []
    }));
  } catch (error) {
    console.error('Error en mostrarJuegos:', error);
    throw error;
  }
};
export const mostrarJuegoPorId = async (idjuego) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        juego.idjuego,
        juego.titulo,
        juego.descripcion,
        juego.precio,
        juego.fecha_lanzamiento,
        juego.clasificacion_edad,
        juego.url_trailer,
        juego.url_portada,
        GROUP_CONCAT(DISTINCT desarrollador.nombre) nombre_desarrollador,
        GROUP_CONCAT(DISTINCT editor.nombre) nombre_editor,
        GROUP_CONCAT(DISTINCT genero.nombre) nombre_genero
      FROM juego
      LEFT JOIN juego_has_desarrollador ON juego.idjuego = juego_has_desarrollador.juego_idjuego
      LEFT JOIN desarrollador ON juego_has_desarrollador.desarrollador_iddesarrollador = desarrollador.iddesarrollador
      LEFT JOIN editor_has_juego ON juego.idjuego = editor_has_juego.juego_idjuego
      LEFT JOIN editor ON editor_has_juego.editor_ideditor = editor.ideditor
      LEFT JOIN juego_has_genero ON juego.idjuego = juego_has_genero.juego_idjuego
      LEFT JOIN genero ON juego_has_genero.genero_idgenero = genero.idgenero
      WHERE juego.idjuego = ?
      GROUP BY juego.idjuego`, [idjuego]);
    return rows[0];
  } catch (error) {
    console.error('Hubo un error al mostrar el juego:', error);
    throw error;
  }
};
export const crearJuego = async (juego) => {
  const { titulo, descripcion, precio, fecha_lanzamiento, clasificacion_edad, url_trailer, url_portada } = juego;
  const [result] = await pool.query(
    `INSERT INTO juego (titulo, descripcion, precio, fecha_lanzamiento, clasificacion_edad, url_trailer, url_portada)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [titulo, descripcion, precio, fecha_lanzamiento, clasificacion_edad, url_trailer, url_portada]
  );
  return result.insertId;
};
export const buscarJuegos = async (searchTerm) => {
    let query = `
        SELECT DISTINCT
            juego.*,
            GROUP_CONCAT(DISTINCT desarrollador.nombre) AS nombre_desarrollador,
            GROUP_CONCAT(DISTINCT editor.nombre) AS nombre_editor,
            GROUP_CONCAT(DISTINCT genero.nombre) AS nombre_genero
        FROM juego
        LEFT JOIN juego_has_desarrollador ON juego.idjuego = juego_has_desarrollador.juego_idjuego
        LEFT JOIN desarrollador ON juego_has_desarrollador.desarrollador_iddesarrollador = desarrollador.iddesarrollador
        LEFT JOIN editor_has_juego ON juego.idjuego = editor_has_juego.juego_idjuego
        LEFT JOIN editor ON editor_has_juego.editor_ideditor = editor.ideditor
        LEFT JOIN juego_has_genero ON juego.idjuego = juego_has_genero.juego_idjuego
        LEFT JOIN genero ON juego_has_genero.genero_idgenero = genero.idgenero`;
    const params = [];
    if (searchTerm) {
        query += ` WHERE LOWER(juego.titulo) LIKE LOWER(?)`;
        params.push(`%${searchTerm}%`);
    }
    query += ` GROUP BY juego.idjuego ORDER BY juego.titulo`;
    const [juegos] = await pool.query(query, params);
    return juegos;
};
export const filtrarGenero = async (generos = []) => {
    if (!generos.length) return [];
    const query = `
        SELECT DISTINCT
            juego.*
        FROM juego
        INNER JOIN juego_has_genero ON juego.idjuego = juego_has_genero.juego_idjuego
        WHERE juego_has_genero.genero_idgenero IN (${generos.map(() => '?').join(',')})
        GROUP BY juego.idjuego
        HAVING COUNT(DISTINCT juego_has_genero.genero_idgenero) = ?
        ORDER BY juego.titulo`;
    const params = [...generos, generos.length];
    const [juegos] = await pool.query(query, params);
    return juegos;
};
