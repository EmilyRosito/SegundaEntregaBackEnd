import { Router } from 'express';
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
    fs.writeFile(path, JSON.stringify(data, null, '\t'), (err) => {
        if (err) {
            console.error(`Error al escribir el archivo: ${path}`, err);
        }
    });
};

let productosInfo = leerInfo('./info/productos.json');

router.get('/', (req, res) => {
    res.json(productosInfo);
});

router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const producto = productosInfo.find(producto => producto.id === parseInt(pid, 10));

    if (!producto) {
        res.status(404).json({ error: 'No se encuentra el producto con el id solicitado' });
    } else {
        res.json(producto);
    }
});

router.post('/', (req, res) => {
    const { title, description, code, price, stock, category } = req.body;
    let newId = productosInfo.length ? productosInfo[productosInfo.length - 1].id + 1 : 1;

    if (!title || !description || !code || typeof price !== 'number' || typeof stock !== 'number' || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios y deben ser del tipo correcto' });
    }

    let nuevoProducto = {
        id: newId,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category
    };

    productosInfo.push(nuevoProducto);
    escribirInfo('./info/productos.json', productosInfo);
    res.json(productosInfo);
});

router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, stock, category } = req.body;

    if (!title || !description || !code || typeof price !== 'number' || typeof stock !== 'number' || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios y deben ser del tipo correcto' });
    }

    let productoIndex = productosInfo.findIndex(producto => producto.id === parseInt(pid, 10));

    if (productoIndex === -1) {
        res.status(404).json({ error: 'No se encuentra el producto con el id solicitado' });
    } else {
        productosInfo[productoIndex] = {
            id: parseInt(pid, 10),
            title,
            description,
            code,
            price,
            stock,
            category
        };

        escribirInfo('./info/productos.json', productosInfo);
        res.json(productosInfo[productoIndex]);
    }
});

router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    let productoIndex = productosInfo.findIndex(producto => producto.id === parseInt(pid, 10));

    if (productoIndex === -1) {
        res.status(404).json(`No se encuentra el producto con el id: ${pid} solicitado`);
    } else {
        let [productoEliminado] = productosInfo.splice(productoIndex, 1);
        escribirInfo('./info/productos.json', productosInfo);
        res.json(productoEliminado);
    }
});

export default router;
