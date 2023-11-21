require('dotenv').config();

const jwt = require('jsonwebtoken');

function autenticarToken(requisicao, respostaRequisicao, continua) {
  const autenticacaoCabecalho = requisicao.headers['authorization'];
  const token = autenticacaoCabecalho && autenticacaoCabecalho.split(' ')[1];

  if (token == null) {
    return respostaRequisicao.sendStatus(401);
  }

  jwt.verify(
    token,
    process.env.TOKEN_ACESSO,
    (erroValidacaoToken, sucessoValidacaoToken) => {
      if (erroValidacaoToken) {
        return respostaRequisicao.sendStatus(403);
      }
      respostaRequisicao.locals = sucessoValidacaoToken;

      continua();
    }
  );
}

module.exports = { autenticarToken: autenticarToken };
