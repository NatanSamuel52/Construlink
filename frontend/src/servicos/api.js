import { API_URL } from '../config/api';
export async function buscarServicos() {
  const resposta = await fetch(`${API_URL}/servicos`);

  if (!resposta.ok) {
    throw new Error('Erro ao buscar serviços');
  }
  const dados = await resposta.json();

  return dados;
}

export async function buscarProfissionais(servico) {
  const nomeServico = encodeURIComponent(servico);

  const resposta = await fetch(
    `${API_URL}/profissionais?servico=${nomeServico}`,
  );

  if (!resposta.ok) {
    throw new Error('Erro ao consultar profissionais');
  }

  const dados = await resposta.json();

  return dados;
}

export async function buscarTodosProfissionais() {
  const resposta = await fetch(`${API_URL}/profissionais`);

  if (!resposta.ok) {
    throw new Error('Erro ao consultar profissionais');
  }

  const dados = await resposta.json();

  return dados;
}

export async function buscarServicosDoProfissional(id) {
  const resposta = await fetch(`${API_URL}/profissionais/${id}/servicos`);

  if (!resposta.ok) {
    throw new Error('Erro ao consultar serviços do profissional');
  }

  const dados = await resposta.json();

  return dados;
}

export async function buscarQuantidadeProfissionais() {
  const resposta = await fetch(`${API_URL}/profissionais/quantidade`);

  if (!resposta.ok) {
    throw new Error('Erro ao consultar quantidade de profissionais');
  }

  const dados = await resposta.json();

  return dados;
}

export async function buscarMeuPerfilProfissional(token) {
  const resposta = await fetch(`${API_URL}/meu-perfil-profissional`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Erro ao consultar perfil profissional');
  }

  return dados;
}

export async function atualizarMeuPerfilProfissional(token, dadosPerfil) {
  const resposta = await fetch(`${API_URL}/meu-perfil-profissional`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dadosPerfil),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Erro ao atualizar perfil profissional');
  }

  return dados;
}
