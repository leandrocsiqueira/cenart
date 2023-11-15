const express = require('express');
const conexaoDb = require('../conexao');
const rota = express.Router();
const autenticacao = require('../services/autenticacao');

rota.post(
  '/adicionarArtigo',
  autenticacao.autenticarToken,
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
  autenticacao.autenticarToken,
  (_requisicao, respostaRequisicao) => {
    const operacaoDql = `SELECT a.id, a.titulo, a.conteudo, 
      c.id as categoriaId, c.nome as categoriaNome, 
      a.dataPublicacao, a.status 
    FROM artigo AS a
    INNER JOIN categoria AS c
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
      c.id as categoriaId, c.nome as categoriaNome
    FROM artigo AS a
    INNER JOIN categoria AS c
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
  autenticacao.autenticarToken,
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
  autenticacao.autenticarToken,
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
