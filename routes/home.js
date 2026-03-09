const express = require('express');
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
module.exports = homeRouter; 
