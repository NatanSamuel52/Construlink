import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Rodape from '../../componentes-reutilizaveis/Rodape/Rodape.jsx';
import { obterSessao, salvarSessao } from '../../utils/auth';
import { API_URL } from '../../config/api';

import {
  buscarMeuPerfilProfissional,
  buscarServicos,
  buscarServicosDoProfissional,
  atualizarMeuPerfilProfissional,
  atualizarTrabalho,
  excluirTrabalho,
} from '../../servicos/api';

import './PerfilProfissional.css';

export default function PerfilProfissional() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [trabalhos, setTrabalhos] = useState([]);
  const [trabalhoEditando, setTrabalhoEditando] = useState(null);
  const [tituloTrabalho, setTituloTrabalho] = useState('');
  const [descricaoTrabalho, setDescricaoTrabalho] = useState('');
  const [fotoTrabalho, setFotoTrabalho] = useState(null);
  const [salvandoTrabalho, setSalvandoTrabalho] = useState(false);
  const [mensagemTrabalho, setMensagemTrabalho] = useState('');
  const [erroTrabalho, setErroTrabalho] = useState('');
  const [excluindoTrabalhoId, setExcluindoTrabalhoId] = useState(null);
  const [trabalhoParaExcluir, setTrabalhoParaExcluir] = useState(null);

  function iniciarEdicaoTrabalho(trabalho) {
    setTrabalhoEditando(trabalho);
    setTituloTrabalho(trabalho.titulo || '');
    setDescricaoTrabalho(trabalho.descricao || '');
    setFotoTrabalho(null);
    setMensagemTrabalho('');
    setErroTrabalho('');
  }

  function cancelarEdicaoTrabalho() {
    setTrabalhoEditando(null);
    setTituloTrabalho('');
    setDescricaoTrabalho('');
    setFotoTrabalho(null);
    setMensagemTrabalho('');
    setErroTrabalho('');
  }

  async function salvarEdicaoTrabalho(event) {
    event.preventDefault();

    const sessao = obterSessao();

    if (!sessao?.token || !trabalhoEditando) {
      setErroTrabalho('Não foi possível identificar a sessão ou o trabalho.');
      return;
    }

    setSalvandoTrabalho(true);
    setMensagemTrabalho('');
    setErroTrabalho('');

    try {
      await atualizarTrabalho(
        sessao.token,
        trabalhoEditando.id,
        {
          titulo: tituloTrabalho.trim(),
          descricao: descricaoTrabalho.trim(),
        },
        fotoTrabalho,
      );

      const resposta = await fetch(
        `${API_URL}/profissionais/${perfil.profissional_id}/trabalhos`,
      );

      if (!resposta.ok) {
        throw new Error(
          'Trabalho atualizado, mas não foi possível atualizar a lista.',
        );
      }

      setTrabalhos(await resposta.json());
      cancelarEdicaoTrabalho();
      setMensagemTrabalho('Trabalho atualizado com sucesso.');
    } catch (erro) {
      setErroTrabalho(erro.message || 'Erro ao atualizar trabalho.');
    } finally {
      setSalvandoTrabalho(false);
    }
  }

  async function confirmarExclusaoTrabalho(trabalho) {
    const sessao = obterSessao();

    if (!sessao?.token) {
      setErroTrabalho('Sua sessão expirou. Entre novamente.');
      return;
    }

    setExcluindoTrabalhoId(trabalho.id);
    setMensagemTrabalho('');
    setErroTrabalho('');

    try {
      await excluirTrabalho(sessao.token, trabalho.id);

      setTrabalhos((atuais) =>
        atuais.filter((item) => item.id !== trabalho.id),
      );

      setTrabalhoParaExcluir(null);

      if (trabalhoEditando?.id === trabalho.id) {
        cancelarEdicaoTrabalho();
      }

      setMensagemTrabalho('Trabalho excluído com sucesso.');
    } catch (erro) {
      setErroTrabalho(erro.message || 'Erro ao excluir trabalho.');
    } finally {
      setExcluindoTrabalhoId(null);
    }
  }

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
  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [previsualizacaoFoto, setPrevisualizacaoFoto] = useState('');

  useEffect(() => {
    return () => {
      if (previsualizacaoFoto) {
        URL.revokeObjectURL(previsualizacaoFoto);
      }
    };
  }, [previsualizacaoFoto]);

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

  function solicitarExclusaoTrabalho(trabalho) {
    setTrabalhoParaExcluir(trabalho);
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
    setArquivoFoto(null);
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
    setArquivoFoto(null);
    setPrevisualizacaoFoto('');
    setEditando(false);

    setMensagemFormulario('');

    setErroFormulario('');
  }

  function selecionarFotoPerfil(evento) {
    const arquivo = evento.target.files?.[0];

    if (!arquivo) {
      setArquivoFoto(null);
      setPrevisualizacaoFoto('');
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(arquivo.type)) {
      setErroFormulario('Selecione uma imagem PNG, JPG ou WEBP.');
      evento.target.value = '';
      setArquivoFoto(null);
      setPrevisualizacaoFoto('');
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      setErroFormulario('A imagem deve ter no máximo 5 MB.');
      evento.target.value = '';
      setArquivoFoto(null);
      setPrevisualizacaoFoto('');
      return;
    }

    setErroFormulario('');
    setArquivoFoto(arquivo);
    setPrevisualizacaoFoto(URL.createObjectURL(arquivo));
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
        arquivoFoto,
      );

      setPerfil((perfilAnterior) => ({
        ...perfilAnterior,

        ...perfilAtualizado,
      }));
      salvarSessao({
        ...sessao,
        nome: perfilAtualizado.nome,
        foto_perfil_url: perfilAtualizado.foto_perfil_url,
      });
      window.dispatchEvent(new Event('contrulink:sessao-atualizada'));
      setArquivoFoto(null);
      setPrevisualizacaoFoto('');

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
        setErroTrabalho('');

        const dadosPerfil = await buscarMeuPerfilProfissional(sessao.token);

        const [resultadoServicos, resultadoTrabalhos] =
          await Promise.allSettled([
          buscarServicosDoProfissional(dadosPerfil.profissional_id),
          fetch(
            `${API_URL}/profissionais/${dadosPerfil.profissional_id}/trabalhos`,
            { signal: controlador.signal },
          ),
        ]);

        if (resultadoServicos.status === 'rejected') {
          throw resultadoServicos.reason;
        }

        if (!controlador.signal.aborted) {
          setPerfil(dadosPerfil);
          setServicos(resultadoServicos.value);
        }

        try {
          if (resultadoTrabalhos.status === 'rejected') {
            throw resultadoTrabalhos.reason;
          }

          const respostaTrabalhos = resultadoTrabalhos.value;

          if (!respostaTrabalhos.ok) {
            const dadosErro = await respostaTrabalhos.json();
            throw new Error(
              dadosErro.mensagem ||
                'Não foi possível carregar os trabalhos realizados.',
            );
          }

          const dadosTrabalhos = await respostaTrabalhos.json();

          if (!controlador.signal.aborted) {
            setTrabalhos(dadosTrabalhos);
          }
        } catch (erroTrabalhos) {
          if (
            erroTrabalhos.name !== 'AbortError' &&
            !controlador.signal.aborted
          ) {
            console.error(
              'Erro ao carregar trabalhos do profissional:',
              erroTrabalhos,
            );
            setTrabalhos([]);
            setErroTrabalho(
              erroTrabalhos.message ||
                'Não foi possível carregar os trabalhos realizados.',
            );
          }
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
                  <label htmlFor='perfil-foto'>Foto de perfil</label>

                  <div className='perfil-autenticado__foto-edicao'>
                    {previsualizacaoFoto || perfil.foto_perfil_url ? (
                      <img
                        src={
                          previsualizacaoFoto || perfil.foto_perfil_url
                        }
                        alt='Prévia da foto de perfil'
                      />
                    ) : (
                      <span>{perfil.nome?.charAt(0).toUpperCase() || 'P'}</span>
                    )}
                  </div>

                  <input
                    id='perfil-foto'
                    type='file'
                    accept='image/png,image/jpeg,image/webp'
                    onChange={selecionarFotoPerfil}
                    disabled={salvando}
                  />

                  <small>
                    Escolha uma imagem PNG, JPG ou WEBP de até 5 MB. A prévia
                    aparece antes de salvar.
                  </small>
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
              {mensagemTrabalho && <p role='status'>{mensagemTrabalho}</p>}
              {erroTrabalho && <p role='alert'>{erroTrabalho}</p>}

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

                      <button
                        type='button'
                        onClick={() => iniciarEdicaoTrabalho(trabalho)}
                        disabled={
                          salvandoTrabalho || excluindoTrabalhoId !== null
                        }
                      >
                        Editar
                      </button>

                      <button
                        type='button'
                        onClick={() => solicitarExclusaoTrabalho(trabalho)}
                        disabled={
                          salvandoTrabalho || excluindoTrabalhoId !== null
                        }
                      >
                        {excluindoTrabalhoId === trabalho.id
                          ? 'Excluindo...'
                          : 'Excluir'}
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                !erroTrabalho && (
                  <p>Você ainda não possui trabalhos cadastrados.</p>
                )
              )}
            </div>

            {trabalhoEditando && (
              <form
                className='perfil-autenticado__formulario'
                onSubmit={salvarEdicaoTrabalho}
              >
                <h3>Editar trabalho</h3>

                <div className='perfil-autenticado__campo'>
                  <label htmlFor='titulo-trabalho'>Título</label>
                  <input
                    id='titulo-trabalho'
                    type='text'
                    value={tituloTrabalho}
                    onChange={(evento) =>
                      setTituloTrabalho(evento.target.value)
                    }
                    maxLength={150}
                    required
                    disabled={salvandoTrabalho}
                  />
                </div>

                <div className='perfil-autenticado__campo'>
                  <label htmlFor='descricao-trabalho'>Descrição</label>
                  <textarea
                    id='descricao-trabalho'
                    value={descricaoTrabalho}
                    onChange={(evento) =>
                      setDescricaoTrabalho(evento.target.value)
                    }
                    maxLength={500}
                    required
                    disabled={salvandoTrabalho}
                  />
                </div>

                <div className='perfil-autenticado__campo'>
                  <label htmlFor='foto-trabalho'>Nova foto (opcional)</label>
                  <input
                    id='foto-trabalho'
                    type='file'
                    accept='image/png,image/jpeg,image/webp'
                    onChange={(evento) =>
                      setFotoTrabalho(evento.target.files?.[0] || null)
                    }
                    disabled={salvandoTrabalho}
                  />
                </div>

                <button type='submit' disabled={salvandoTrabalho}>
                  {salvandoTrabalho ? 'Salvando...' : 'Salvar alterações'}
                </button>

                <button
                  type='button'
                  onClick={cancelarEdicaoTrabalho}
                  disabled={salvandoTrabalho}
                >
                  Cancelar
                </button>
              </form>
            )}
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

      {trabalhoParaExcluir && (
        <div
          className='perfil-autenticado__modal-overlay'
          onClick={() => setTrabalhoParaExcluir(null)}
        >
          <section
            className='perfil-autenticado__modal'
            role='alertdialog'
            aria-modal='true'
            aria-labelledby='titulo-modal-exclusao-trabalho'
            aria-describedby='descricao-modal-exclusao-trabalho'
            onClick={(evento) => evento.stopPropagation()}
          >
            <div className='perfil-autenticado__modal-icone'>
              <span aria-hidden='true'>!</span>
            </div>

            <h2 id='titulo-modal-exclusao-trabalho'>Excluir trabalho?</h2>

            <p id='descricao-modal-exclusao-trabalho'>
              Deseja realmente excluir{' '}
              <strong>{trabalhoParaExcluir.titulo}</strong> dos seus trabalhos
              realizados?
            </p>

            <div className='perfil-autenticado__modal-acoes'>
              <button
                type='button'
                className='perfil-autenticado__botao-secundario'
                onClick={() => setTrabalhoParaExcluir(null)}
                disabled={excluindoTrabalhoId !== null}
              >
                Cancelar
              </button>

              <button
                type='button'
                className='perfil-autenticado__botao-remover'
                onClick={() => confirmarExclusaoTrabalho(trabalhoParaExcluir)}
                disabled={excluindoTrabalhoId !== null}
              >
                {excluindoTrabalhoId === trabalhoParaExcluir.id
                  ? 'Excluindo...'
                  : 'Sim, excluir'}
              </button>
            </div>
          </section>
        </div>
      )}

      <Rodape />
    </>
  );
}
