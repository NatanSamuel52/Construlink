const CHAVE_SESSAO = "contrulink_sessao";

// Sessão mockada — sem backend real ainda

// Guarda só o e-mail, o suficiente pra simular um usuário autenticado.

export function salvarSessao(email) {
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify({ email }));
}

export function obterSessao() {
  const dados = localStorage.getItem(CHAVE_SESSAO);
  return dados ? JSON.parse(dados) : null;
}

export function limparSessao() {
  localStorage.removeItem(CHAVE_SESSAO);
}
