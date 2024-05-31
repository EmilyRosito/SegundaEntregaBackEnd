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

router.get('/', (req, res) => {
    res.json(productosInfo);
});

router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const producto = productosInfo.find(producto => producto.id == pid);

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

    let producto = productosInfo.find(producto => producto.id == pid);

    if (!producto) {
        res.status(404).json({ error: 'No se encuentra el producto con el id pedido' });
    } else {
        producto.title = title;
        producto.description = description;
        producto.code = code;
        producto.price = price;
        producto.stock = stock;
        producto.category = category;

        escribirInfo('./info/productos.json', productosInfo);
        res.json(producto);
    }
});


router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    let productoIndex = productosInfo.findIndex(producto => producto.id == pid);

    if (productoIndex === -1) {
        res.status(400).json(`No se encuentra el producto con el id: ${pid} pedido`);
    } else {
        let [productoEliminado] = productosInfo.splice(productoIndex, 1);
        escribirInfo('./info/productos.json', productosInfo);
        res.json(productoEliminado);
    }
});

export default router;
