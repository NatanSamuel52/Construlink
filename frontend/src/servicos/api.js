import { API_URL } from '../config/api';

export async function buscarServicos() {
  const resposta = await fetch(`${API_URL}/servicos`);

  if (!resposta.ok) {
    throw new Error('Erro ao buscar serviços');
  }

  return resposta.json();
}

export async function buscarProfissionais(servico) {
  const nomeServico = encodeURIComponent(servico);
  const resposta = await fetch(
    `${API_URL}/profissionais?servico=${nomeServico}`,
  );

  if (!resposta.ok) {
    throw new Error('Erro ao consultar profissionais');
  }

  return resposta.json();
}

export async function buscarTodosProfissionais() {
  const resposta = await fetch(`${API_URL}/profissionais`);

  if (!resposta.ok) {
    throw new Error('Erro ao consultar profissionais');
  }

  return resposta.json();
}

export async function buscarServicosDoProfissional(id) {
  const resposta = await fetch(`${API_URL}/profissionais/${id}/servicos`);

  if (!resposta.ok) {
    throw new Error('Erro ao consultar serviços do profissional');
  }

  return resposta.json();
}

export async function buscarQuantidadeProfissionais() {
  const resposta = await fetch(`${API_URL}/profissionais/quantidade`);

  if (!resposta.ok) {
    throw new Error('Erro ao consultar quantidade de profissionais');
  }

  return resposta.json();
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

export async function atualizarMeuPerfilProfissional(
  token,
  dadosPerfil,
  arquivoFoto = null,
) {
  const corpo = arquivoFoto ? new FormData() : dadosPerfil;

  if (arquivoFoto) {
    corpo.append('nome', dadosPerfil.nome);
    corpo.append('descricao', dadosPerfil.descricao ?? '');
    corpo.append('foto', arquivoFoto);
  }

  const resposta = await fetch(`${API_URL}/meu-perfil-profissional`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(arquivoFoto ? {} : { 'Content-Type': 'application/json' }),
    },
    body: arquivoFoto ? corpo : JSON.stringify(corpo),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Erro ao atualizar perfil profissional');
  }

  return dados;
}

export async function atualizarTrabalho(
  token,
  id,
  dadosTrabalho,
  arquivoFoto = null,
) {
  const corpo = arquivoFoto ? new FormData() : dadosTrabalho;

  if (arquivoFoto) {
    corpo.append('titulo', dadosTrabalho.titulo);
    corpo.append('descricao', dadosTrabalho.descricao ?? '');
    corpo.append('foto', arquivoFoto);
  }

  const resposta = await fetch(`${API_URL}/trabalhos/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(arquivoFoto ? {} : { 'Content-Type': 'application/json' }),
    },
    body: arquivoFoto ? corpo : JSON.stringify(corpo),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Erro ao atualizar trabalho');
  }

  return dados;
}

export async function excluirTrabalho(token, id) {
  const resposta = await fetch(`${API_URL}/trabalhos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Erro ao excluir trabalho');
  }

  return dados;
}

export async function iniciarConversa(
  token,
  { profissional_id, servico_id },
) {
  const resposta = await fetch(`${API_URL}/conversas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ profissional_id, servico_id }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Erro ao iniciar conversa');
  }

  return dados.conversa;
}

export async function buscarConversa(token, conversaId) {
  const resposta = await fetch(`${API_URL}/conversas/${conversaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Erro ao carregar detalhes da conversa');
  }

  return dados;
}

export async function buscarMensagens(token, conversaId) {
  const resposta = await fetch(
    `${API_URL}/conversas/${conversaId}/mensagens`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Erro ao carregar mensagens');
  }

  return dados;
}

export async function enviarMensagem(token, conversaId, conteudo) {
  const resposta = await fetch(
    `${API_URL}/conversas/${conversaId}/mensagens`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ conteudo }),
    },
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Erro ao enviar mensagem');
  }

  return dados;
}

export async function buscarMinhasConversas(token) {
  const resposta = await fetch(`${API_URL}/conversas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Erro ao consultar conversas');
  }

  return dados;
}

export async function buscarConversasNaoLidas(token) {
  const conversas = await buscarMinhasConversas(token);

  return conversas.some((conversa) => Number(conversa.mensagens_nao_lidas) > 0);
}
