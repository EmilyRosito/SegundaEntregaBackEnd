import express from 'express';
import productosRutas from './routes/productos.routes.js';
import carritoRutas from './routes/carrito.routes.js';

const app = express();
const PUERTO = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/productos', productosRutas);
app.use('/api/carrito', carritoRutas);

app.listen(PUERTO, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
});
