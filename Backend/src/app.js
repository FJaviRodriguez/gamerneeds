import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import juegosRoutes from './routes/juegos.js';
import generosRoutes from './routes/genero.js';
import stripeRoutes from './routes/stripe.js';
import usuarioRoutes from './routes/usuario.js';
import bibliotecaRouter from './routes/biblioteca.js';
import multer from 'multer';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.js';
import { conexionbdd } from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || '0.0.0.0';

// Enhanced CORS configuration
const corsOptions = {
    origin: [
        'http://107.22.32.241:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY');
    process.exit(1);
}

app.use('/api/stripe', stripeRoutes);

app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const dbConnected = await conexionbdd();
        if (!dbConnected) {
            throw new Error('Database connection failed');
        }
        res.status(200).json({
            status: 'healthy',
            database: 'connected'
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

// Static files configuration
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/images', express.static('public/juegos'));
app.use('/public/avatars', express.static('public/avatars'));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
  }
});

// API routes
app.use('/api/juegos', juegosRoutes);
app.use('/api/generos', generosRoutes);
app.use('/api/pagos', stripeRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/biblioteca', bibliotecaRouter);
app.use('/api', routes);
app.use('/api', healthRoutes);

// Enhanced error handling
app.use((err, req, res, next) => {
    console.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    
    res.status(500).json({
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
        path: req.path
    });
});

// Start server with enhanced logging
const server = app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
});

export default app;
