require('dotenv').config();

const mysqlDb = require('mysql');

const conexao = mysqlDb.createConnection({
  port: process.env.PORTA_BD,
  host: process.env.HOST_DB,
  user: process.env.NOME_USUARIO_DB,
  password: process.env.SENHA_DB,
  database: process.env.NOME_DB,
});

conexao.connect((erroConexao) => {
  if (!erroConexao) {
    console.log('Conexão estabelecida com o banco de dados.');
  } else {
    console.log(erroConexao);
  }
});

module.exports = conexao;
