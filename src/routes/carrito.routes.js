mport { Router } from 'express';
import fs from 'fs';

const router = Router();

const leerInfo = (path) => {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    } catch (err) {
        console.error(`Error al leer el archivo: ${path}`, err);
        return [];
    }
};

const escribirInfo = (path, data) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data, null, '\t'));
    } catch (err) {
        console.error(`Error al escribir el archivo: ${path}`, err);
    }
};

let productosInfo = leerInfo('./info/productos.json');
let carritosInfo = leerInfo('./info/carrito.json');

router.post('/', (req, res) => {
    const newCartId = carritosInfo.length ? carritosInfo[carritosInfo.length - 1].id + 1 : 1;
    const nuevoCarrito = {
        id: newCartId,
        productos: []
    };

    carritosInfo.push(nuevoCarrito);
    escribirInfo('./info/carrito.json', carritosInfo);
    res.json(carritosInfo);
});

router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const carritoId = parseInt(cid, 10);
    const carrito = carritosInfo.find(c => c.id === carritoId);

    if (!carrito) {
        res.status(400).json(`No se encuentra el carrito con el id: ${cid}, pide uno entre el 1 y el ${carritosInfo.length}`);
    } else {
        res.json(carrito);
    }
});

router.post('/:cid/producto/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const carritoId = parseInt(cid, 10);
    const productoId = parseInt(pid, 10);

    const carrito = carritosInfo.find(c => c.id === carritoId);
    const producto = productosInfo.find(p => p.id === productoId);

    if (!carrito) {
        res.status(400).json(`No se encuentra el carrito con el id: ${cid}, pide uno entre el 1 y el ${carritosInfo.length}`);
    } else if (!producto) {
        res.status(400).json(`No se encuentra el producto con el id: ${pid}, pide uno entre el 1 y el ${productosInfo.length}`);
    } else {
        const productoExistente = carrito.products.find(p => p.product === productoId);
        if (productoExistente) {
            productoExistente.quantity += 1;
        } else {
            carrito.producto.push({ producto: productoId, quantity: 1 });
        }

        escribirInfo('./info/carrito.json', carritosInfo);
        res.json(carrito);
    }
});

export default router;

