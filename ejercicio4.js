const express = require('express'); 

const app = express(); // Inicializamos la aplicación de Express
const homeRouter=require('./routes/home');
const productsRouter=require('./routes/productos');

app.use(express.json()); // Middleware: permite que Express entienda el formato JSON que mandas en el Body (POST)
app.use('/',homeRouter);
app.use('/productos',productsRouter);

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));