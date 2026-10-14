import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterSessao } from '../../utils/auth.js';
import Rodape from '../../componentes-reutilizaveis/Rodape/Rodape.jsx';
import './CadastroTrabalho.css';

const API_URL = 'http://localhost:3000/api';

export default function CadastroTrabalho() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState(null);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  function selecionarFoto(evento) {
    const arquivo = evento.target.files?.[0];

    if (!arquivo) return;

    const formatosPermitidos = ['image/png', 'image/jpeg', 'image/webp'];

    if (!formatosPermitidos.includes(arquivo.type)) {
      setErro('Selecione uma imagem PNG, JPG ou WEBP.');
      evento.target.value = '';
      setFoto(null);
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      setErro('A imagem deve ter no máximo 5 MB.');
      evento.target.value = '';
      setFoto(null);
      return;
    }

    setErro('');
    setFoto(arquivo);
  }

  async function salvarTrabalho(evento) {
    evento.preventDefault();
    setErro('');

    const tituloFormatado = titulo.trim();
    const descricaoFormatada = descricao.trim();

    if (!foto || !tituloFormatado || !descricaoFormatada) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    if (tituloFormatado.length > 150) {
      setErro('O título deve ter no máximo 150 caracteres.');
      return;
    }

    if (descricaoFormatada.length > 500) {
      setErro('A descrição deve ter no máximo 500 caracteres.');
      return;
    }

    const sessao = obterSessao();

    if (!sessao?.token) {
      setErro('Sua sessão expirou. Entre novamente na sua conta.');
      return;
    }

    if (sessao.papel !== 'profissional') {
      setErro('Somente profissionais podem cadastrar trabalhos.');
      return;
    }

    const dados = new FormData();
    dados.append('titulo', tituloFormatado);
    dados.append('descricao', descricaoFormatada);
    dados.append('foto', foto);

    setSalvando(true);

    try {
      const resposta = await fetch(`${API_URL}/trabalhos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessao.token}`,
        },
        body: dados,
      });

      const resultado = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          resultado.mensagem || 'Não foi possível cadastrar o trabalho.',
        );
      }

      navigate('/meu-perfil-profissional', {
        state: { trabalhoCadastrado: true },
      });
    } catch (erroEnvio) {
      setErro(
        erroEnvio.message ||
          'Não foi possível conectar ao servidor. Tente novamente.',
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className='cadastro-trabalho'>
      <main className='cadastro-trabalho__conteudo'>
        <button
          type='button'
          className='cadastro-trabalho__voltar'
          onClick={() => navigate('/meu-perfil-profissional')}
        >
          ← Voltar ao perfil
        </button>

        <h1>Cadastrar trabalho realizado</h1>

        <p className='cadastro-trabalho__introducao'>
          Compartilhe um trabalho que você realizou e mostre sua experiência.
        </p>

        <form
          onSubmit={salvarTrabalho}
          className='cadastro-trabalho__formulario'
        >
          <div className='cadastro-trabalho__campo'>
            <label htmlFor='foto-trabalho'>Foto do trabalho *</label>

            <input
              id='foto-trabalho'
              type='file'
              accept='image/png,image/jpeg,image/webp'
              onChange={selecionarFoto}
              required
            />

            <small>PNG, JPG ou WEBP. Tamanho máximo: 5 MB.</small>

            {foto && <small>Arquivo selecionado: {foto.name}</small>}
          </div>

          <div className='cadastro-trabalho__campo'>
            <label htmlFor='titulo-trabalho'>Título do trabalho *</label>

            <input
              id='titulo-trabalho'
              type='text'
              value={titulo}
              onChange={(evento) => setTitulo(evento.target.value)}
              maxLength={150}
              placeholder='Ex.: Instalação elétrica residencial'
              required
            />
          </div>

          <div className='cadastro-trabalho__campo'>
            <label htmlFor='descricao-trabalho'>Descrição *</label>

            <textarea
              id='descricao-trabalho'
              value={descricao}
              onChange={(evento) => setDescricao(evento.target.value)}
              maxLength={500}
              placeholder='Descreva o trabalho realizado...'
              rows={5}
              required
            />

            <small>{descricao.length}/500 caracteres</small>
          </div>

          <p className='cadastro-trabalho__aviso'>
            Este trabalho será associado ao seu perfil profissional.
          </p>

          {erro && (
            <p className='cadastro-trabalho__erro' role='alert'>
              {erro}
            </p>
          )}

          <div className='cadastro-trabalho__acoes'>
            <button
              type='button'
              className='cadastro-trabalho__cancelar'
              onClick={() => navigate('/meu-perfil-profissional')}
              disabled={salvando}
            >
              Cancelar
            </button>

            <button
              type='submit'
              className='cadastro-trabalho__salvar'
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Salvar trabalho'}
            </button>
          </div>
        </form>
      </main>

      <Rodape />
    </div>
  );
}
