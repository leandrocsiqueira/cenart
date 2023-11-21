require('dotenv').config();

const express = require('express');
const conexaoDb = require('../conexao');
const rota = express.Router();
const jwt = require('jsonwebtoken');
const autenticacao = require('../services/autenticacao');

rota.post(
  '/adicionarUsuario',
  autenticacao.autenticarToken,
  (requisicao, respostaRequisicao) => {
    const usuario = requisicao.body;
    let operacaoDql = `SELECT email, senha, status FROM usuario 
    WHERE email=?;`;

    conexaoDb.query(
      operacaoDql,
      [usuario.email],
      (erroConexao, registroRetornado) => {
        if (!erroConexao) {
          if (registroRetornado.length <= 0) {
            operacaoDql = `INSERT INTO usuario (nome, email, senha, status, podeSerExcluido) 
              VALUES(?, ?, ?, 'false', 'true');`;

            conexaoDb.query(
              operacaoDql,
              [usuario.nome, usuario.email, usuario.senha],
              (erroGravacaoRegistro) => {
                if (!erroGravacaoRegistro) {
                  return respostaRequisicao
                    .status(200)
                    .json({ message: 'Usuário cadastrado com sucesso!' });
                } else {
                  return respostaRequisicao
                    .status(500)
                    .json(erroGravacaoRegistro);
                }
              }
            );
          } else {
            return respostaRequisicao.status(400).json({
              message: 'Este endereço de e-mail já está sendo utilizado.',
            });
          }
        } else {
          return respostaRequisicao.status(500).json(erroConexao);
        }
      }
    );
  }
);

rota.post('/login', (requisicao, respostaRequisicao) => {
  const dadosInformados = requisicao.body;
  let operacaoDql = `SELECT email, senha, status, podeSerExcluido 
    FROM usuario 
    WHERE email = ?;`;

  conexaoDb.query(
    operacaoDql,
    [dadosInformados.email],
    (erroConexao, registroRetornado) => {
      if (!erroConexao) {
        if (
          registroRetornado.length <= 0 ||
          registroRetornado[0].senha != dadosInformados.senha
        ) {
          return respostaRequisicao.status(401).json({
            message: 'E-mail ou Senha informados incorretos.',
          });
        } else if (registroRetornado[0].status == 'false') {
          return respostaRequisicao
            .status(401)
            .json({ message: 'Usuário ainda precisa ser aprovado.' });
        } else if (registroRetornado[0].senha == dadosInformados.senha) {
          const usuario = {
            email: registroRetornado[0].email,
            podeSerExcluido: registroRetornado[0].podeSerExcluido,
          };
          const tokenAcesso = jwt.sign(usuario, process.env.TOKEN_ACESSO, {
            expiresIn: '8h',
          });
          respostaRequisicao.status(200).json({ token: tokenAcesso });
        } else {
          return respostaRequisicao
            .status(400)
            .json({ message: 'Algo deu errado. Tente novamente.' });
        }
      } else return respostaRequisicao.status(500).json(erroConexao);
    }
  );
});

rota.get(
  '/listarUsuarios',
  autenticacao.autenticarToken,
  (_requisicao, respostaRequisicao) => {
    const payloadToken = respostaRequisicao.locals;
    let operacaoDql = '';

    if (payloadToken.isDeletable === 'false') {
      operacaoDql = `SELECT id, nome, email, status FROM usuario 
        WHERE podeSerExcluido = 'true';`;
    } else {
      operacaoDql = `SELECT id, nome, email, status FROM usuario 
        WHERE podeSerExcluido = 'true' AND email !=?;`;
    }

    conexaoDb.query(
      operacaoDql,
      [payloadToken.email],
      (erroConexao, registrosRetornados) => {
        if (!erroConexao) {
          return respostaRequisicao.status(200).json(registrosRetornados);
        } else {
          return respostaRequisicao.status(500).json(erroConexao);
        }
      }
    );
  }
);

rota.post(
  '/atualizarNomeEmail',
  autenticacao.autenticarToken,
  (requisicao, respostaRequisicao) => {
    const usuario = requisicao.body;
    const operacaoDql = `UPDATE usuario SET nome = ?, email = ? 
      WHERE id = ?;`;

    conexaoDb.query(
      operacaoDql,
      [usuario.nome, usuario.email, usuario.id],
      (erroConexao, resultadoOperacao) => {
        if (!erroConexao) {
          if (resultadoOperacao.affectedRows == 0) {
            return respostaRequisicao
              .status(404)
              .json({ message: 'Usuário não cadastrado.' });
          }
          return respostaRequisicao
            .status(200)
            .json({ message: 'O usuário foi atualizado.' });
        } else {
          return respostaRequisicao.status(500).json(erroConexao);
        }
      }
    );
  }
);

rota.post(
  '/atualizarStatus',
  autenticacao.autenticarToken,
  (requisicao, respostaRequisicao) => {
    const dadosInformados = requisicao.body;
    const operacaoDql = `UPDATE usuario SET status = ? 
    WHERE id = ? AND podeSerExcluido = 'true';`;
    conexaoDb.query(
      operacaoDql,
      [dadosInformados.status, dadosInformados.id],
      (erroConexao, resultadoOperacao) => {
        if (!erroConexao) {
          if (resultadoOperacao.affectedRows == 0) {
            return respostaRequisicao
              .status(404)
              .json({ message: 'Usuário não encontrado.' });
          }
          return respostaRequisicao
            .status(200)
            .json({ message: 'O status do usuário foi atualizado.' });
        } else {
          return respostaRequisicao.status(500).json(erroConexao);
        }
      }
    );
  }
);

rota.get(
  '/verificarToken',
  autenticacao.autenticarToken,
  (_requisicao, respostaRequisicao) => {
    return respostaRequisicao.status(200).json({ message: 'true' });
  }
);

module.exports = rota;
