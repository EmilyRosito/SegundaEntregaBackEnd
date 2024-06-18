import express from 'express';
import http from 'http';
import handlebars from 'express-handlebars';
import path from 'path';
import fs from 'fs/promises';
import { Server as SocketIO } from 'socket.io';
import productosRutas from './routes/products.routes.js';
import carritoRutas from './routes/carrito.routes.js';
import viewsRoutes from './routes/views.routes.js';
import __dirname from './dirname.js'; 

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIO(httpServer);

const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine('hbs', handlebars({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '../views/layouts'), 
}));
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, '../views'));
app.use(express.static(path.resolve(__dirname, '../public')));


app.use('/', viewsRoutes);


io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.emit('getProducts', productos);

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});


let productos = [];
const loadProductos = async () => {
  try {
    const info = await fs.readFile(path.resolve(__dirname, '../info/productos.json'), 'utf-8');
    productos = JSON.parse(info);
  } catch (error) {
    console.error('Error loading productos:', error);
    productos = []; 
  }
};

loadProductos().catch(err => console.error('Failed to load products:', err));


app.use('/api/productos', productosRutas);
app.use('/api/carrito', carritoRutas);


httpServer.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
