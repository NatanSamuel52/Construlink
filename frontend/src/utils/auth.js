const CHAVE_SESSAO = 'contrulink_sessao';

// Salva os dados do usuário autenticado no armazenamento local
export function salvarSessao(usuario) {
  const dados = typeof usuario === 'string' ? { email: usuario } : usuario;
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(dados));
}

// Retorna os dados do usuário autenticado ou null
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
