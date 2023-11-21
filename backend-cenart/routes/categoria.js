const express = require('express');
const conexao = require('../conexao');
const rota = express.Router();
const autenticacao = require('../services/autenticacao');

rota.post(
  '/adicionar',
  autenticacao.autenticarToken,
  (requisicao, respostaRequisicao) => {
    const categoria = requisicao.body;
    const operacaoDml = `INSERT INTO categoria (nome) VALUES(?)`;
    conexao.query(operacaoDml, [categoria.nome], (erroConexao) => {
      if (!erroConexao) {
        return respostaRequisicao
          .status(200)
          .json({ message: 'Categoria cadastrada.' });
      } else {
        return respostaRequisicao.status(500).json(erroConexao);
      }
    });
  }
);

rota.get(
  '/listarCategorias',
  autenticacao.autenticarToken,
  (_requisicao, respostaRequisicao) => {
    const operacaoDql = `SELECT * FROM categoria ORDER BY nome;`;
    conexao.query(operacaoDql, (erroConexao, registrosRetornados) => {
      if (!erroConexao) {
        return respostaRequisicao.status(200).json(registrosRetornados);
      } else {
        return respostaRequisicao.status(500).json(erroConexao);
      }
    });
  }
);

rota.post(
  '/atualizarCategoria',
  autenticacao.autenticarToken,
  (requisicao, respostaRequisicao) => {
    const categoria = requisicao.body;
    const operacaoDml = `UPDATE categoria SET nome = ? WHERE id = ?;`;
    conexao.query(
      operacaoDml,
      [categoria.nome, categoria.id],
      (erroConexao, resultadoOperacao) => {
        if (!erroConexao) {
          if (resultadoOperacao.affectedRows == 0) {
            return respostaRequisicao
              .status(404)
              .json({ message: 'Categoria não encontrada.' });
          }
          return respostaRequisicao
            .status(200)
            .json({ message: 'Categoria atualizada.' });
        } else {
          return respostaRequisicao.status(500).json(erroConexao);
        }
      }
    );
  }
);

module.exports = rota;
