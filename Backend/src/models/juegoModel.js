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

    return rows; 
  } catch (error) {
    console.error('Error en mostrarJuegos:', error);
    throw error;
  }
};
export const mostrarJuegoPorId = async (idjuego) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        juego.*,
        GROUP_CONCAT(DISTINCT desarrollador.nombre) AS nombre_desarrollador,
        GROUP_CONCAT(DISTINCT editor.nombre) AS nombre_editor,
        GROUP_CONCAT(DISTINCT genero.nombre) AS nombre_genero,
        GROUP_CONCAT(DISTINCT desarrollador.iddesarrollador) AS desarrolladores_ids,
        GROUP_CONCAT(DISTINCT editor.ideditor) AS editores_ids,
        GROUP_CONCAT(DISTINCT genero.idgenero) AS generos_ids
      FROM juego
      LEFT JOIN juego_has_desarrollador ON juego.idjuego = juego_has_desarrollador.juego_idjuego
      LEFT JOIN desarrollador ON juego_has_desarrollador.desarrollador_iddesarrollador = desarrollador.iddesarrollador
      LEFT JOIN editor_has_juego ON juego.idjuego = editor_has_juego.juego_idjuego
      LEFT JOIN editor ON editor_has_juego.editor_ideditor = editor.ideditor
      LEFT JOIN juego_has_genero ON juego.idjuego = juego_has_genero.juego_idjuego
      LEFT JOIN genero ON juego_has_genero.genero_idgenero = genero.idgenero
      WHERE juego.idjuego = ?
      GROUP BY juego.idjuego`, 
      [idjuego]
    );
    return rows[0];
  } catch (error) {
    console.error('Error en mostrarJuegoPorId:', error);
    throw error;
  }
};
export const crearJuego = async (juego, desarrolladores, editores, generos) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insertar el juego con la url_portada
    const [result] = await connection.query(
      `INSERT INTO juego (titulo, descripcion, precio, fecha_lanzamiento, clasificacion_edad, url_trailer, url_portada)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        juego.titulo,
        juego.descripcion,
        juego.precio,
        juego.fecha_lanzamiento,
        juego.clasificacion_edad,
        juego.url_trailer,
        juego.url_portada
      ]
    );

    const juegoId = result.insertId;

    // Insertar desarrolladores
    if (desarrolladores && desarrolladores.length > 0) {
      const desarrolladoresValues = desarrolladores
        .map(idDev => [juegoId, idDev])
        .map(row => '(?, ?)').join(',');
      
      await connection.query(
        `INSERT INTO juego_has_desarrollador (juego_idjuego, desarrollador_iddesarrollador) 
         VALUES ${desarrolladoresValues}`,
        desarrolladores.flatMap(idDev => [juegoId, idDev])
      );
    }

    // Insertar editores
    if (editores && editores.length > 0) {
      const editoresValues = editores
        .map(idEditor => [juegoId, idEditor])
        .map(row => '(?, ?)').join(',');
      
      await connection.query(
        `INSERT INTO editor_has_juego (juego_idjuego, editor_ideditor) 
         VALUES ${editoresValues}`,
        editores.flatMap(idEditor => [juegoId, idEditor])
      );
    }

    // Insertar géneros
    if (generos && generos.length > 0) {
      const generosValues = generos
        .map(idGenero => [juegoId, idGenero])
        .map(row => '(?, ?)').join(',');
      
      await connection.query(
        `INSERT INTO juego_has_genero (juego_idjuego, genero_idgenero) 
         VALUES ${generosValues}`,
        generos.flatMap(idGenero => [juegoId, idGenero])
      );
    }

    await connection.commit();
    return juegoId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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
export const eliminarJuego = async (idjuego) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Eliminar registros relacionados primero
    await connection.query('DELETE FROM juego_has_desarrollador WHERE juego_idjuego = ?', [idjuego]);
    await connection.query('DELETE FROM editor_has_juego WHERE juego_idjuego = ?', [idjuego]);
    await connection.query('DELETE FROM juego_has_genero WHERE juego_idjuego = ?', [idjuego]);
    
    // Obtener la URL de la portada antes de eliminar el juego
    const [juego] = await connection.query('SELECT url_portada FROM juego WHERE idjuego = ?', [idjuego]);
    
    // Eliminar el juego
    await connection.query('DELETE FROM juego WHERE idjuego = ?', [idjuego]);
    
    await connection.commit();
    return juego[0]?.url_portada;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
export const obtenerImagenJuego = async (idjuego) => {
  try {
    const [rows] = await pool.query(
      'SELECT url_portada FROM juego WHERE idjuego = ?',
      [idjuego]
    );
    return rows[0]?.url_portada;
  } catch (error) {
    console.error('Error en obtenerImagenJuego:', error);
    throw error;
  }
};

export const editarJuego = async (idjuego, juegoData) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      titulo, 
      descripcion, 
      precio, 
      fecha_lanzamiento,
      clasificacion_edad, 
      url_trailer, 
      url_portada,
      desarrolladores, 
      editores, 
      generos
    } = juegoData;

    // Validar y preparar datos
    const tituloValidado = titulo?.substring(0, 255) || ''; // VARCHAR(255)
    const descripcionValidada = descripcion || ''; // TEXT no necesita truncado
    const precioValidado = parseFloat(precio) || 0;
    const clasificacionValidada = parseInt(clasificacion_edad) || 0;
    const urlTrailerValidado = url_trailer?.substring(0, 255) || '';

    let updateQuery = `
      UPDATE juego 
      SET titulo = ?,
          descripcion = ?,
          precio = ?,
          fecha_lanzamiento = ?,
          clasificacion_edad = ?,
          url_trailer = ?
    `;
    
    let updateParams = [
      tituloValidado,
      descripcionValidada,
      precioValidado,
      fecha_lanzamiento || null,
      clasificacionValidada,
      urlTrailerValidado
    ];

    if (url_portada) {
      updateQuery += `, url_portada = ?`;
      updateParams.push(url_portada);
    }

    updateQuery += ` WHERE idjuego = ?`;
    updateParams.push(idjuego);

    // Log para debugging
    console.log('Query de actualización:', updateQuery);
    console.log('Parámetros:', updateParams);

    // Ejecutar actualización
    await connection.query(updateQuery, updateParams);

    // Procesar desarrolladores
    const desarrolladoresArray = JSON.parse(Array.isArray(desarrolladores) ? 
      JSON.stringify(desarrolladores) : 
      desarrolladores || '[]'
    );

    // Procesar editores
    const editoresArray = JSON.parse(Array.isArray(editores) ? 
      JSON.stringify(editores) : 
      editores || '[]'
    );

    // Procesar géneros
    const generosArray = JSON.parse(Array.isArray(generos) ? 
      JSON.stringify(generos) : 
      generos || '[]'
    );

    // Actualizar relaciones usando transacción
    await connection.query('DELETE FROM juego_has_desarrollador WHERE juego_idjuego = ?', [idjuego]);
    if (desarrolladoresArray.length > 0) {
      const desarrolladoresValues = desarrolladoresArray.map(dev => [idjuego, dev]);
      await connection.query(
        'INSERT INTO juego_has_desarrollador (juego_idjuego, desarrollador_iddesarrollador) VALUES ?',
        [desarrolladoresValues]
      );
    }

    await connection.query('DELETE FROM editor_has_juego WHERE juego_idjuego = ?', [idjuego]);
    if (editoresArray.length > 0) {
      const editoresValues = editoresArray.map(ed => [idjuego, ed]);
      await connection.query(
        'INSERT INTO editor_has_juego (juego_idjuego, editor_ideditor) VALUES ?',
        [editoresValues]
      );
    }

    await connection.query('DELETE FROM juego_has_genero WHERE juego_idjuego = ?', [idjuego]);
    if (generosArray.length > 0) {
      const generosValues = generosArray.map(gen => [idjuego, gen]);
      await connection.query(
        'INSERT INTO juego_has_genero (juego_idjuego, genero_idgenero) VALUES ?',
        [generosValues]
      );
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    console.error('Error en editarJuego:', error);
    throw error;
  } finally {
    connection.release();
  }
};
