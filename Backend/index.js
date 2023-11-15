const express = require('express');
const cors = require('cors');
const app = express();
const rotaUsuario = require('./routes/usuario');
const rotaCategoria = require('./routes/categoria');
const rotaArtigo = require('./routes/artigo');

app.use(cors());
app.use(express.json());

app.use('/usuario', rotaUsuario);
app.use('/categoria', rotaCategoria);
app.use('/artigo', rotaArtigo);

module.exports = app;
