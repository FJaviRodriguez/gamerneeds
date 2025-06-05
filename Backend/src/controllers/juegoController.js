// src/controllers/juegoController.js
import * as juegoModel from '../models/juegoModel.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// creo que esto al final del multer no funcionaba y lo hice de otra manera, pero lo dejo por si acaso
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/images/juegos'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('El archivo debe ser una imagen'), false);
  }
};
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export const mostrarJuegos = async (req, res) => {
  console.log('Recibida petición para mostrar juegos');
  try {
    const juegos = await juegoModel.mostrarJuegos();
    if (!juegos || juegos.length === 0) {
      return res.status(404).json({ 
        message: 'No se encontraron juegos' 
      });
    }

    // Procesar las URLs de las imágenes
    const juegosConUrls = juegos.map(juego => ({
      ...juego,
      url_portada: juego.url_portada 
        ? `${process.env.BACKEND_URL}/public/juegos/${juego.url_portada}`
        : `${process.env.BACKEND_URL}/public/juegos/prueba.jpg`
    }));

    res.json(juegosConUrls);
  } catch (error) {
    console.error('Error al mostrar juegos:', error);
    res.status(500).json({ message: error.message });
  }
};

export const mostrarJuegoPorId = async (req, res) => {
  try {
    const { idjuego } = req.params;
    const juego = await juegoModel.mostrarJuegoPorId(idjuego);
    if (!juego) {
      return res.status(404).json({ 
        message: `No se encontró el juego con id ${idjuego}` 
      });
    }

    // Procesar la URL de la imagen
    const juegoConUrl = {
      ...juego,
      url_portada: juego.url_portada 
        ? `${process.env.BACKEND_URL}/public/juegos/${juego.url_portada}`
        : `${process.env.BACKEND_URL}/public/default-game.jpg`
    };

    res.json(juegoConUrl);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al mostrar el juego',
      error: error.message 
    });
  }
};
// aun no hay un admin que pueda crear juegos, pero lo habra
export const crearJuego = async (req, res) => {
  try {
    const juegoData = {
      ...req.body,
      url_portada: req.file ? req.file.filename : 'default-game.jpg',
      url_trailer: req.body.url_trailer || '',
      descripcion: req.body.descripcion || '',
      clasificacion_edad: req.body.clasificacion_edad || 0,
      fecha_lanzamiento: req.body.fecha_lanzamiento || null
    };

    // Solo validamos los campos realmente necesarios
    const requiredFields = ['titulo', 'precio'];
    const missingFields = requiredFields.filter(field => !juegoData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Faltan campos requeridos: ${missingFields.join(', ')}`
      });
    }

    const idjuego = await juegoModel.crearJuego(juegoData);
    
    res.status(201).json({ 
      message: 'Juego creado correctamente', 
      idjuego,
      url_portada: juegoData.url_portada ? 
        `${process.env.BACKEND_URL}/public/juegos/${juegoData.url_portada}` : 
        `${process.env.BACKEND_URL}/public/juegos/default-game.jpg`
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Hubo un error al intentar insertar un juego', 
      error: error.message 
    });
  }
};
export const buscarJuegos = async (req, res) => {
    try {
        const { q = '' } = req.query;
        const juegos = await juegoModel.buscarJuegos(q);
        res.json(juegos);
    } catch (error) {
        console.error('Hubo un error al buscar:', error);
        res.status(500).json({ 
            mensaje: 'Hubo un error en la busqueda de juegos',
            error: error.message 
        });
    }
};
export const filtrarGenero = async (req, res) => {
    try {
        const { generos } = req.query;
        let generosArray = [];  
        if (generos) {
            generosArray = generos.split(',').map(id => parseInt(id, 10));
            generosArray = generosArray.filter(id => !isNaN(id));
        }
        const juegos = await juegoModel.filtrarGenero(generosArray);
        res.json(juegos);
    } catch (error) {
        console.error('Hubo un error al filtrar por generos:', error);
        res.status(500).json({ 
            mensaje: 'Hubo un error al filtrar por generos',
            error: error.message 
        });
    }
};
