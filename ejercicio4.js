const express = require('express');
const app = express();

app.use(express.json());

// ── ROUTER HOME ──────────────────────────────────────────
const homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
    console.log('Query params:', req.query);
    res.json({ status: 'OK', pagina: 'Home', metodo: 'GET' });
});

homeRouter.post('/', (req, res) => {
    console.log('Body recibido:', req.body);
    res.json({ status: 'OK', pagina: 'Home', metodo: 'POST' });
});

// ── ROUTER PRODUCTS ───────────────────────────────────────
const productsRouter = express.Router();
let products = [
    { id: 1, nombre: "Laptop", precio: 999, categoria: "Electrónica" },
    { id: 2, nombre: "Ratón Inalámbrico", precio: 25, categoria: "Electrónica" },
    { id: 3, nombre: "Teclado Mecánico", precio: 79, categoria: "Electrónica" },
    { id: 4, nombre: "Monitor 27\"", precio: 350, categoria: "Electrónica" },
    { id: 5, nombre: "Silla Ergonómica", precio: 250, categoria: "Muebles" }
];
let nextId = 6; // Empieza en 6 para que los nuevos no colisionen con los anteriores

productsRouter.get('/', (req, res) => {
    res.json({ status: 'OK', pagina: 'Products', metodo: 'GET', data: products });
});

productsRouter.post('/', (req, res) => {
    const { nombre, precio, categoria } = req.body;

    // Validación: campos obligatorios
    if (!nombre || !precio) {
        return res.json({ 
            status: 'ERROR', 
            mensaje: 'Los campos nombre y precio son obligatorios' 
        });
    }

    // Validación: precio debe ser un número positivo
    if (typeof precio !== 'number' || precio <= 0) {
        return res.json({ 
            status: 'ERROR', 
            mensaje: 'El precio debe ser un número positivo' 
        });
    }

    // Solo usamos los campos que nos interesan, el id lo ignoramos aunque venga
    const newProduct = { 
        id: nextId++,   // El id lo ponemos nosotros, siempre
        nombre, 
        precio, 
        categoria: categoria || 'Sin categoría'  // Valor por defecto si no viene
    };

    products.push(newProduct);
    res.json({ status: 'OK', pagina: 'Products', metodo: 'POST', data: newProduct });
});

productsRouter.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    // Validación: el id debe ser un número válido
    if (isNaN(id)) {
        return res.json({ status: 'ERROR', mensaje: 'El ID debe ser un número' });
    }

    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
        return res.json({ status: 'ERROR', mensaje: 'Producto no encontrado' });
    }

    const { nombre, precio, categoria } = req.body;

    // Validación: al menos un campo debe venir para actualizar
    if (!nombre && !precio && !categoria) {
        return res.json({ 
            status: 'ERROR', 
            mensaje: 'Debes enviar al menos un campo para actualizar' 
        });
    }

    // Mantenemos los datos anteriores y solo actualizamos los que vienen
    products[index] = { 
        ...products[index],  // Datos anteriores
        ...(nombre && { nombre }),      // Solo actualiza si viene
        ...(precio && { precio }),
        ...(categoria && { categoria })
    };

    res.json({ status: 'OK', pagina: 'Products', metodo: 'PUT', data: products[index] });
});

productsRouter.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.json({ status: 'ERROR', mensaje: 'Producto no encontrado' });
    const deleted = products.splice(index, 1);
    res.json({ status: 'OK', pagina: 'Products', metodo: 'DELETE', data: deleted[0] });
});

// ── CONECTAR ROUTERS AL SERVIDOR ─────────────────────────
app.use('/', homeRouter);
app.use('/productos', productsRouter);

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));