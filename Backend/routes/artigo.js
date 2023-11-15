const express = require('express');
const conexaoDb = require('../connection');
const rota = express.Router();
const autenticacao = require('../services/authentication');

rota.post(
  '/adicionarArtigo',
  autenticacao.authenticateToken,
  (requisicao, respostaRequisicao) => {
    const artigo = requisicao.body;
    const operacaoDml = `INSERT INTO artigo 
    (titulo, conteudo, categoriaId, dataPublicacao, status) 
    VALUES (?, ?, ?, ?, ?);`;
    conexaoDb.query(
      operacaoDml,
      [
        artigo.titulo,
        artigo.conteudo,
        artigo.categoriaId,
        new Date(),
        artigo.status,
      ],
      (erroGravacaoRegistro) => {
        if (!erroGravacaoRegistro) {
          return respostaRequisicao
            .status(200)
            .json({ message: 'Artigo cadastrado com sucesso.' });
        } else {
          return respostaRequisicao.status(500).json(erroGravacaoRegistro);
        }
      }
    );
  }
);

rota.get(
  '/listarTodosArtigos',
  autenticacao.authenticateToken,
  (_requisicao, respostaRequisicao) => {
    const operacaoDql = `SELECT a.id, a.titulo, a.conteudo, 
      c.id as categoryId, c.name as categoryName, 
      a.dataPublicacao, a.status 
    FROM artigo AS a
    INNER JOIN category AS c
    ON a.categoriaId = c.id;`;

    conexaoDb.query(operacaoDql, (erroConexao, registrosRetornados) => {
      if (!erroConexao) {
        return respostaRequisicao.status(200).json(registrosRetornados);
      } else {
        return respostaRequisicao.status(500).json(erroConexao);
      }
    });
  }
);

rota.get('/listarArtigosPublicados', (_requisicao, respostaRequisicao) => {
  const operacaoDql = `SELECT a.id, a.titulo, a.conteudo, 
      a.status, a.dataPublicacao, 
      c.id as categoryId, c.name as categoryName 
    FROM artigo AS a
    INNER JOIN category AS c
    WHERE (a.categoriaId = c.id AND a.status = 'publicado');`;

  conexaoDb.query(operacaoDql, (erroConexao, registrosRetornados) => {
    if (!erroConexao) {
      return respostaRequisicao.status(200).json(registrosRetornados);
    } else {
      return respostaRequisicao.status(500).json(erroConexao);
    }
  });
});

rota.put(
  '/atualizarArtigo',
  autenticacao.authenticateToken,
  (requisicao, respostaRequisicao) => {
    const artigo = requisicao.body;
    const operacaoDml = `UPDATE artigo SET 
        titulo = ?, 
        conteudo = ?, 
        categoriaId = ?, 
        dataPublicacao = ?, 
        status = ?
      WHERE id = ?;`;
    conexaoDb.query(
      operacaoDml,
      [
        artigo.titulo,
        artigo.conteudo,
        artigo.categoriaId,
        new Date(),
        artigo.status,
        artigo.id,
      ],
      (erroConexao, resultadoOperacao) => {
        if (!erroConexao) {
          if (resultadoOperacao.affectedRows == 0) {
            return respostaRequisicao
              .status(404)
              .json({ message: 'Artigo não encontrado.' });
          }
          return respostaRequisicao
            .status(200)
            .json({ message: 'Artigo atualizado.' });
        } else {
          return respostaRequisicao.status(500).json(erroConexao);
        }
      }
    );
  }
);

rota.delete(
  '/excluirArtigo/:id',
  autenticacao.authenticateToken,
  (requisicao, respostaRequisicao) => {
    const idArtigo = requisicao.params.id;
    const operacaoDml = `DELETE FROM artigo WHERE id = ?;`;
    conexaoDb.query(
      operacaoDml,
      [idArtigo],
      (erroConexao, resultadoOperacao) => {
        if (!erroConexao) {
          if (resultadoOperacao.affectedRows == 0) {
            return respostaRequisicao
              .status(404)
              .json({ message: 'Artigo não encontrado.' });
          }
          return respostaRequisicao
            .status(200)
            .json({ message: 'Artigo excluído.' });
        } else {
          return respostaRequisicao.status(500).json(erroConexao);
        }
      }
    );
  }
);

module.exports = rota;
