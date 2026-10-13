const CHAVE_SESSAO = 'contrulink_sessao';

// Salva os dados do usuário e o token da autenticação
export function salvarSessao(usuario, token = null) {
  const dados = typeof usuario === 'string' ? { email: usuario } : usuario;

  localStorage.setItem(
    CHAVE_SESSAO,
    JSON.stringify({ ...dados, token: token ?? dados.token ?? null }),
  );
}

// Retorna os dados da sessão ou null
export function obterSessao() {
  try {
    const dados = localStorage.getItem(CHAVE_SESSAO);
    return dados ? JSON.parse(dados) : null;
  } catch {
    return null;
  }
}

// Remove os dados da sessão
export function limparSessao() {
  localStorage.removeItem(CHAVE_SESSAO);
}

// Verifica se existe usuário autenticado
export function estaAutenticado() {
  return Boolean(obterSessao());
}
