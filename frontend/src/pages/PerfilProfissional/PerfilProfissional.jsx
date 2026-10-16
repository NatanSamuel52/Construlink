import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Rodape from '../../componentes-reutilizaveis/Rodape/Rodape.jsx';
import { obterSessao } from '../../utils/auth';
import { API_URL } from '../../config/api';

import {
  buscarMeuPerfilProfissional,
  buscarServicos,
  buscarServicosDoProfissional,
  atualizarMeuPerfilProfissional,
} from '../../servicos/api';

import './PerfilProfissional.css';

export default function PerfilProfissional() {
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);

  const [servicos, setServicos] = useState([]);

  const [trabalhos, setTrabalhos] = useState([]);

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState('');

  const [cadastrandoServico, setCadastrandoServico] = useState(false);

  const [catalogoServicos, setCatalogoServicos] = useState([]);

  const [servicoSelecionado, setServicoSelecionado] = useState('');

  const [salvandoServico, setSalvandoServico] = useState(false);

  const [mensagemServico, setMensagemServico] = useState('');

  const [erroServico, setErroServico] = useState('');

  const [editando, setEditando] = useState(false);

  const [salvando, setSalvando] = useState(false);

  const [mensagemFormulario, setMensagemFormulario] = useState('');

  const [erroFormulario, setErroFormulario] = useState('');

  const [servicoParaRemover, setServicoParaRemover] = useState(null);

  const [dadosFormulario, setDadosFormulario] = useState({
    nome: '',

    foto_perfil_url: '',

    descricao: '',
  });

  function atualizarCampo(campo, valor) {
    setDadosFormulario((dadosAtuais) => ({
      ...dadosAtuais,

      [campo]: valor,
    }));
  }

  async function abrirCadastroServico() {
    setMensagemServico('');

    setErroServico('');

    setServicoSelecionado('');

    setCadastrandoServico(true);

    try {
      const catalogo = await buscarServicos();

      setCatalogoServicos(catalogo);
    } catch (erro) {
      setErroServico(
        erro.message || 'Não foi possível carregar os serviços disponíveis.',
      );
    }
  }

  function cancelarCadastroServico() {
    setCadastrandoServico(false);

    setServicoSelecionado('');

    setMensagemServico('');

    setErroServico('');
  }

  async function salvarServico(evento) {
    evento.preventDefault();

    const sessao = obterSessao();

    if (!sessao?.token) {
      setErroServico('Sua sessão expirou. Entre novamente.');

      return;
    }

    if (!servicoSelecionado) {
      setErroServico('Selecione um serviço.');

      return;
    }

    setSalvandoServico(true);

    setMensagemServico('');

    setErroServico('');

    try {
      const resposta = await fetch(`${API_URL}/ofertas-servico`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',

          Authorization: `Bearer ${sessao.token}`,
        },

        body: JSON.stringify({
          servico_id: servicoSelecionado,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || 'Não foi possível cadastrar o serviço.',
        );
      }

      const servicosAtualizados = await buscarServicosDoProfissional(
        perfil.profissional_id,
      );

      setServicos(servicosAtualizados);

      setCadastrandoServico(false);

      setServicoSelecionado('');

      setMensagemServico(dados.mensagem || 'Serviço cadastrado com sucesso.');
    } catch (erro) {
      setErroServico(erro.message || 'Ocorreu um erro ao cadastrar o serviço.');
    } finally {
      setSalvandoServico(false);
    }
  }

  function solicitarRemocaoServico(servico) {
    setServicoParaRemover(servico);
  }

  async function removerServico(servicoId) {
    const sessao = obterSessao();

    if (!sessao?.token) {
      setErroServico('Sua sessão expirou. Entre novamente.');

      return;
    }

    setErroServico('');

    setMensagemServico('');

    try {
      const resposta = await fetch(`${API_URL}/ofertas-servico/${servicoId}`, {
        method: 'DELETE',

        headers: {
          Authorization: `Bearer ${sessao.token}`,
        },
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || 'Não foi possível remover o serviço.',
        );
      }

      const servicosAtualizados = await buscarServicosDoProfissional(
        perfil.profissional_id,
      );

      setServicos(servicosAtualizados);

      setServicoParaRemover(null);

      abrirEdicao();

      setMensagemServico(dados.mensagem || 'Serviço removido com sucesso.');
    } catch (erro) {
      setErroServico(erro.message || 'Ocorreu um erro ao remover o serviço.');
    }
  }

  function abrirEdicao() {
    setDadosFormulario({
      nome: perfil.nome || '',

      foto_perfil_url: perfil.foto_perfil_url || '',

      descricao: perfil.descricao || '',
    });

    setMensagemFormulario('');

    setErroFormulario('');

    setEditando(true);
  }

  function cancelarEdicao() {
    setEditando(false);

    setMensagemFormulario('');

    setErroFormulario('');
  }

  async function salvarEdicao(evento) {
    evento.preventDefault();

    const sessao = obterSessao();

    if (!sessao?.token) {
      setErroFormulario('Sua sessão expirou. Entre novamente.');

      return;
    }

    const nome = dadosFormulario.nome.trim();

    if (nome.length < 2) {
      setErroFormulario('Informe um nome com pelo menos 2 caracteres.');

      return;
    }

    if (nome.length > 150) {
      setErroFormulario('O nome deve ter no máximo 150 caracteres.');

      return;
    }

    setSalvando(true);

    setMensagemFormulario('');

    setErroFormulario('');

    try {
      const perfilAtualizado = await atualizarMeuPerfilProfissional(
        sessao.token,

        {
          nome,

          foto_perfil_url: dadosFormulario.foto_perfil_url.trim() || null,

          descricao: dadosFormulario.descricao.trim() || null,
        },
      );

      setPerfil((perfilAnterior) => ({
        ...perfilAnterior,

        ...perfilAtualizado,
      }));

      setMensagemFormulario('Perfil atualizado com sucesso.');

      setEditando(false);
    } catch (erroSalvar) {
      setErroFormulario(
        erroSalvar.message || 'Não foi possível atualizar o perfil.',
      );
    } finally {
      setSalvando(false);
    }
  }

  useEffect(() => {
    const controlador = new AbortController();

    async function carregarDados() {
      const sessao = obterSessao();

      if (!sessao?.token) {
        setErro('Sua sessão expirou. Entre novamente.');

        setCarregando(false);

        return;
      }

      try {
        setCarregando(true);

        setErro('');

        const dadosPerfil = await buscarMeuPerfilProfissional(sessao.token);

        const [respostaServicos, respostaTrabalhos] = await Promise.all([
          buscarServicosDoProfissional(dadosPerfil.profissional_id),

          fetch(
            `${API_URL}/profissionais/${dadosPerfil.profissional_id}/trabalhos`,

            { signal: controlador.signal },
          ),
        ]);

        if (!respostaTrabalhos.ok) {
          throw new Error('Não foi possível carregar os trabalhos realizados.');
        }

        const dadosTrabalhos = await respostaTrabalhos.json();

        if (!controlador.signal.aborted) {
          setPerfil(dadosPerfil);

          setServicos(respostaServicos);

          setTrabalhos(dadosTrabalhos);
        }
      } catch (erroConsulta) {
        if (erroConsulta.name !== 'AbortError') {
          console.error('Erro ao carregar perfil profissional:', erroConsulta);

          setErro(
            erroConsulta.message || 'Não foi possível carregar o perfil.',
          );
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarDados();

    return () => controlador.abort();
  }, []);

  if (carregando) {
    return (
      <>
        <main className='perfil-autenticado'>
          <p className='perfil-autenticado__estado'>Carregando seu perfil...</p>
        </main>

        <Rodape />
      </>
    );
  }

  if (erro || !perfil) {
    return (
      <>
        <main className='perfil-autenticado'>
          <p className='perfil-autenticado__erro' role='alert'>
            {erro || 'Não foi possível encontrar seu perfil profissional.'}
          </p>

          <button type='button' onClick={() => navigate('/login')}>
            Voltar para o login
          </button>
        </main>

        <Rodape />
      </>
    );
  }

  return (
    <>
      <main className='perfil-autenticado'>
        <aside className='perfil-autenticado__chamada'>
          <span className='perfil-autenticado__linha' />

          <h1>
            Profissionais constroem <strong>novas histórias</strong>
          </h1>

          <p>Seu trabalho gera confiança e transforma projetos em realidade.</p>
        </aside>

        <div className='perfil-autenticado__conteudo'>
          <section className='perfil-autenticado__card'>
            <header className='perfil-autenticado__titulo'>
              <h2>Meu perfil profissional</h2>

              <p>
                Mantenha suas informações atualizadas para que mais clientes
                encontrem seus serviços.
              </p>
            </header>

            <div className='perfil-autenticado__dados'>
              <div className='perfil-autenticado__foto'>
                {perfil.foto_perfil_url ? (
                  <img
                    src={perfil.foto_perfil_url}
                    alt={`Foto de ${perfil.nome}`}
                  />
                ) : (
                  <span>{perfil.nome?.charAt(0).toUpperCase() || 'P'}</span>
                )}
              </div>

              <div className='perfil-autenticado__informacoes'>
                <h3>{perfil.nome}</h3>

                <p className='perfil-autenticado__papel'>Profissional</p>

                <h4>Descrição profissional</h4>

                <p className='perfil-autenticado__descricao'>
                  {perfil.descricao || 'Adicione uma descrição ao seu perfil.'}
                </p>
              </div>

              {!editando && (
                <button
                  type='button'
                  className='perfil-autenticado__botao-secundario'
                  onClick={abrirEdicao}
                >
                  Editar perfil
                </button>
              )}
            </div>

            {editando && (
              <form
                className='perfil-autenticado__formulario'
                onSubmit={salvarEdicao}
              >
                <div className='perfil-autenticado__campo'>
                  <label htmlFor='perfil-nome'>Nome completo</label>

                  <input
                    id='perfil-nome'
                    type='text'
                    maxLength={150}
                    minLength={2}
                    required
                    value={dadosFormulario.nome}
                    onChange={(evento) =>
                      atualizarCampo('nome', evento.target.value)
                    }
                    disabled={salvando}
                  />
                </div>

                <div className='perfil-autenticado__campo'>
                  <label htmlFor='perfil-foto'>URL da foto de perfil</label>

                  <input
                    id='perfil-foto'
                    type='url'
                    placeholder='https://exemplo.com/foto.jpg'
                    value={dadosFormulario.foto_perfil_url}
                    onChange={(evento) =>
                      atualizarCampo('foto_perfil_url', evento.target.value)
                    }
                    disabled={salvando}
                  />
                </div>

                <div className='perfil-autenticado__campo'>
                  <label htmlFor='perfil-descricao'>
                    Descrição profissional
                  </label>

                  <textarea
                    id='perfil-descricao'
                    value={dadosFormulario.descricao}
                    onChange={(evento) =>
                      atualizarCampo('descricao', evento.target.value)
                    }
                    disabled={salvando}
                  />
                </div>

                {erroFormulario && (
                  <p
                    className='perfil-autenticado__mensagem perfil-autenticado__mensagem--erro'
                    role='alert'
                  >
                    {erroFormulario}
                  </p>
                )}

                <div className='perfil-autenticado__acoes-formulario'>
                  <button
                    type='submit'
                    className='perfil-autenticado__botao-principal'
                    disabled={salvando}
                  >
                    {salvando ? 'Salvando...' : 'Salvar alterações'}
                  </button>

                  <button
                    type='button'
                    className='perfil-autenticado__botao-secundario'
                    onClick={cancelarEdicao}
                    disabled={salvando}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {!editando && mensagemFormulario && (
              <p className='perfil-autenticado__mensagem' role='status'>
                {mensagemFormulario}
              </p>
            )}
          </section>

          <section className='perfil-autenticado__card'>
            <div className='perfil-autenticado__secao-cabecalho'>
              <div>
                <h2>Serviços oferecidos</h2>

                <p>Os serviços que você oferece aos clientes.</p>
              </div>

              <button
                type='button'
                onClick={abrirCadastroServico}
                disabled={salvandoServico}
              >
                + Cadastrar serviço
              </button>
            </div>

            <div className='perfil-autenticado__lista-servicos'>
              {servicos.length > 0 ? (
                servicos.map((servico) => (
                  <article
                    className='perfil-autenticado__servico'
                    key={servico.id}
                  >
                    <span>{servico.nome}</span>

                    <button
                      type='button'
                      className='perfil-autenticado__botao-remover-servico'
                      onClick={() => solicitarRemocaoServico(servico)}
                    >
                      Remover
                    </button>
                  </article>
                ))
              ) : (
                <p>Você ainda não possui serviços cadastrados.</p>
              )}
            </div>
          </section>

          {cadastrandoServico && (
            <form
              className='perfil-autenticado__formulario'
              onSubmit={salvarServico}
            >
              <div className='perfil-autenticado__campo'>
                <label htmlFor='servico-selecionado'>Serviço disponível</label>

                <select
                  id='servico-selecionado'
                  value={servicoSelecionado}
                  onChange={(evento) =>
                    setServicoSelecionado(evento.target.value)
                  }
                  required
                  disabled={salvandoServico}
                >
                  <option value=''>Selecione um serviço</option>

                  {catalogoServicos.map((servico) => (
                    <option key={servico.id} value={servico.id}>
                      {servico.nome}
                    </option>
                  ))}
                </select>
              </div>

              {erroServico && (
                <p
                  className='perfil-autenticado__mensagem perfil-autenticado__mensagem--erro'
                  role='alert'
                >
                  {erroServico}
                </p>
              )}

              <div className='perfil-autenticado__acoes-formulario'>
                <button
                  type='submit'
                  className='perfil-autenticado__botao-principal'
                  disabled={salvandoServico}
                >
                  {salvandoServico ? 'Salvando...' : 'Salvar serviço'}
                </button>

                <button
                  type='button'
                  className='perfil-autenticado__botao-secundario'
                  onClick={cancelarCadastroServico}
                  disabled={salvandoServico}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {mensagemServico && (
            <p className='perfil-autenticado__mensagem' role='status'>
              {mensagemServico}
            </p>
          )}

          <section className='perfil-autenticado__card'>
            <div className='perfil-autenticado__secao-cabecalho'>
              <div>
                <h2>Trabalhos realizados</h2>

                <p>Adicione e gerencie os trabalhos que você já realizou.</p>
              </div>

              <button
                type='button'
                onClick={() => navigate('/cadastro-trabalho')}
              >
                + Cadastrar trabalho
              </button>
            </div>

            <div className='perfil-autenticado__lista-trabalhos'>
              {trabalhos.length > 0 ? (
                trabalhos.map((trabalho) => (
                  <article
                    className='perfil-autenticado__trabalho'
                    key={trabalho.id}
                  >
                    {trabalho.foto_url && (
                      <img src={trabalho.foto_url} alt={trabalho.titulo} />
                    )}

                    <div>
                      <h3>{trabalho.titulo}</h3>

                      <p>{trabalho.descricao}</p>
                    </div>
                  </article>
                ))
              ) : (
                <p>Você ainda não possui trabalhos cadastrados.</p>
              )}
            </div>
          </section>
        </div>
      </main>

      {servicoParaRemover && (
        <div
          className='perfil-autenticado__modal-overlay'
          onClick={() => setServicoParaRemover(null)}
        >
          <section
            className='perfil-autenticado__modal'
            role='alertdialog'
            aria-modal='true'
            aria-labelledby='titulo-modal-remocao'
            aria-describedby='descricao-modal-remocao'
            onClick={(evento) => evento.stopPropagation()}
          >
            <div className='perfil-autenticado__modal-icone'>
              <span aria-hidden='true'>!</span>
            </div>

            <h2 id='titulo-modal-remocao'>Remover serviço?</h2>

            <p id='descricao-modal-remocao'>
              Deseja realmente remover{' '}
              <strong>{servicoParaRemover.nome}</strong> do seu perfil
              profissional?
            </p>

            <p className='perfil-autenticado__modal-aviso'>
              O serviço continuará disponível no catálogo do Construlink.
            </p>

            <div className='perfil-autenticado__modal-acoes'>
              <button
                type='button'
                className='perfil-autenticado__botao-secundario'
                onClick={() => setServicoParaRemover(null)}
              >
                Cancelar
              </button>

              <button
                type='button'
                className='perfil-autenticado__botao-remover'
                onClick={() => removerServico(servicoParaRemover.id)}
              >
                Sim, remover
              </button>
            </div>
          </section>
        </div>
      )}

      <Rodape />
    </>
  );
}
