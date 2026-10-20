import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Rodape from '../../componentes-reutilizaveis/Rodape/Rodape.jsx';
import {
  buscarConversa,
  buscarMensagens,
  enviarMensagem,
  iniciarConversa,
} from '../../servicos/api.js';
import { obterSessao } from '../../utils/auth.js';
import './Contato.css';

function Avatar({ nome, foto, className }) {
  if (foto) {
    return <img className={className} src={foto} alt={`Foto de ${nome}`} />;
  }

  return (
    <span className={`${className} contato-avatar-placeholder`} aria-hidden='true'>
      {nome?.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );
}

function formatarHora(data) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(data));
}

function formatarData(data) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(data));
}

export default function Contato() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const usuario = obterSessao();
  const token = usuario?.token;
  const servicoId = searchParams.get('servicoId');
  const tipoConversa = searchParams.get('tipo') === 'conversa';

  const [conversa, setConversa] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [carregando, setCarregando] = useState(() => Boolean(token));
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const fimMensagensRef = useRef(null);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let ativo = true;

    async function carregarConversa() {
      setCarregando(true);
      setErro('');

      try {
        const dadosConversa = tipoConversa
          ? await buscarConversa(token, id)
          : await iniciarConversa(token, {
              profissional_id: Number(id),
              servico_id: servicoId ? Number(servicoId) : undefined,
            });
        const mensagensIniciais = await buscarMensagens(
          token,
          dadosConversa.id,
        );

        if (ativo) {
          setConversa(dadosConversa);
          setMensagens(mensagensIniciais);
        }
      } catch (erroConsulta) {
        if (ativo) {
          console.error('Erro ao carregar conversa:', erroConsulta);
          setErro(
            erroConsulta.message || 'Não foi possível carregar a conversa.',
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarConversa();

    return () => {
      ativo = false;
    };
  }, [id, servicoId, tipoConversa, token]);

  useEffect(() => {
    if (!conversa?.id || !token) {
      return undefined;
    }

    let ativo = true;

    async function atualizarMensagens() {
      try {
        const mensagensAtualizadas = await buscarMensagens(token, conversa.id);
        if (ativo) {
          setMensagens(mensagensAtualizadas);
          setErro('');
        }
      } catch (erroConsulta) {
        if (ativo) {
          console.error('Erro ao atualizar mensagens:', erroConsulta);
          setErro(
            erroConsulta.message || 'Não foi possível atualizar as mensagens.',
          );
        }
      }
    }

    const intervalo = window.setInterval(atualizarMensagens, 4000);

    return () => {
      ativo = false;
      window.clearInterval(intervalo);
    };
  }, [conversa?.id, token]);

  useEffect(() => {
    fimMensagensRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  async function handleEnviar(evento) {
    evento.preventDefault();
    const conteudo = novaMensagem.trim();

    if (!conteudo || !conversa?.id || !token || enviando) {
      return;
    }

    setEnviando(true);
    setErro('');

    try {
      const mensagemEnviada = await enviarMensagem(
        token,
        conversa.id,
        conteudo,
      );

      setMensagens((atuais) => {
        if (
          atuais.some(
            (mensagem) => String(mensagem.id) === String(mensagemEnviada.id),
          )
        ) {
          return atuais;
        }

        return [...atuais, mensagemEnviada].sort(
          (a, b) =>
            new Date(a.enviada_em) - new Date(b.enviada_em) ||
            String(a.id).localeCompare(String(b.id), undefined, {
              numeric: true,
            }),
        );
      });
      setNovaMensagem('');
    } catch (erroEnvio) {
      console.error('Erro ao enviar mensagem:', erroEnvio);
      setErro(erroEnvio.message || 'Não foi possível enviar a mensagem.');
    } finally {
      setEnviando(false);
    }
  }

  function voltar() {
    if (tipoConversa) {
      navigate('/mensagens');
      return;
    }

    if (conversa?.profissional_id) {
      navigate(`/perfil-profissional/${conversa.profissional_id}`);
      return;
    }

    navigate(-1);
  }

  if (!usuario || !token) {
    return (
      <>
        <main className='pagina-contato'>
          <section className='contato-estado'>
            <h1>Entre na sua conta para continuar</h1>
            <p>
              Para conversar com um profissional, você precisa estar
              cadastrado e autenticado no Construlink.
            </p>
            <button type='button' onClick={() => navigate('/login')}>
              Entrar
            </button>
          </section>
        </main>
        <Rodape />
      </>
    );
  }

  const eProfissional = usuario.papel === 'profissional';
  const pessoa = eProfissional
    ? {
        nome: conversa?.cliente_nome,
        foto: conversa?.cliente_foto_url,
        titulo: 'Cliente',
      }
    : {
        nome: conversa?.profissional_nome,
        foto: conversa?.profissional_foto_url,
        titulo: 'Profissional',
      };

  if (carregando) {
    return (
      <>
        <main className='pagina-contato'>
          <p className='contato-carregando' role='status'>
            Carregando conversa...
          </p>
        </main>
        <Rodape />
      </>
    );
  }

  return (
    <>
      <main className='pagina-contato'>
        <div className='contato-container'>
          <button type='button' className='contato-voltar' onClick={voltar}>
            ← {tipoConversa ? 'Voltar para mensagens' : 'Voltar para o perfil'}
          </button>

          {erro && (
            <div className='contato-alerta-erro' role='alert'>
              {erro}
            </div>
          )}

          {conversa && (
            <div className='contato-layout'>
              <aside className='contato-perfil'>
                <Avatar
                  nome={pessoa.nome}
                  foto={pessoa.foto}
                  className='contato-foto-perfil'
                />
                <h1>{pessoa.nome || pessoa.titulo}</h1>
                <p className='contato-perfil-tipo'>{pessoa.titulo}</p>

                {!eProfissional && conversa.profissional_descricao && (
                  <p className='contato-descricao'>
                    {conversa.profissional_descricao}
                  </p>
                )}

                <div className='contato-perfil-servico'>
                  <h2>Serviço da conversa</h2>
                  <span>{conversa.servico_nome || 'Serviço'}</span>
                </div>

                <div className='contato-perfil-aviso'>
                  <span aria-hidden='true'>ⓘ</span>
                  <p>
                    {eProfissional
                      ? 'Você está conversando diretamente com o cliente. Responda às dúvidas e combine os detalhes do serviço.'
                      : 'Você está conversando diretamente com o profissional. Envie sua dúvida ou conte o que precisa.'}
                  </p>
                </div>
              </aside>

              <section className='contato-chat-card' aria-label='Conversa'>
                <header className='contato-chat-cabecalho'>
                  <Avatar
                    nome={pessoa.nome}
                    foto={pessoa.foto}
                    className='contato-chat-avatar'
                  />
                  <div>
                    <strong>{pessoa.nome || pessoa.titulo}</strong>
                    <span>{conversa.servico_nome || 'Conversa'}</span>
                  </div>
                </header>

                <div
                  className='contato-mensagens-lista'
                  aria-live='polite'
                  aria-relevant='additions text'
                >
                  {mensagens.length === 0 ? (
                    <div className='contato-vazio'>
                      <span aria-hidden='true'>◌</span>
                      <p>
                        Esta conversa ainda não tem mensagens. Escreva para
                        começar.
                      </p>
                    </div>
                  ) : (
                    mensagens.map((mensagem, indice) => {
                      const eMinha =
                        String(mensagem.remetente_usuario_id) ===
                        String(usuario.id);
                      const dataAnterior = mensagens[indice - 1]?.enviada_em;
                      const mostrarData =
                        !dataAnterior ||
                        new Date(dataAnterior).toDateString() !==
                          new Date(mensagem.enviada_em).toDateString();

                      return (
                        <div key={mensagem.id}>
                          {mostrarData && (
                            <div className='contato-data'>
                              <span>{formatarData(mensagem.enviada_em)}</span>
                            </div>
                          )}
                          <div
                            className={`contato-mensagem-linha ${
                              eMinha
                                ? 'contato-mensagem-linha--minha'
                                : 'contato-mensagem-linha--outra'
                            }`}
                          >
                            {!eMinha && (
                              <Avatar
                                nome={mensagem.remetente_nome}
                                foto={mensagem.remetente_foto_url}
                                className='contato-mensagem-avatar'
                              />
                            )}
                            <div
                              className={`contato-mensagem ${
                                eMinha
                                  ? 'contato-mensagem--minha'
                                  : 'contato-mensagem--outra'
                              }`}
                            >
                              <p>{mensagem.conteudo}</p>
                              <time dateTime={mensagem.enviada_em}>
                                {formatarHora(mensagem.enviada_em)}
                              </time>
                            </div>
                            {eMinha && (
                              <Avatar
                                nome={usuario.nome}
                                foto={usuario.foto_perfil_url}
                                className='contato-mensagem-avatar contato-mensagem-avatar--minha'
                              />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={fimMensagensRef} />
                </div>

                <form className='contato-form-envio' onSubmit={handleEnviar}>
                  <label className='contato-input-rotulo' htmlFor='mensagem'>
                    Digite sua mensagem
                  </label>
                  <input
                    id='mensagem'
                    type='text'
                    className='contato-input-mensagem'
                    placeholder='Digite sua mensagem...'
                    value={novaMensagem}
                    onChange={(evento) => setNovaMensagem(evento.target.value)}
                    disabled={enviando}
                    autoComplete='off'
                  />
                  <button
                    type='submit'
                    className='contato-btn-enviar'
                    disabled={enviando || !novaMensagem.trim()}
                    aria-label='Enviar mensagem'
                    title='Enviar mensagem'
                  >
                    <svg
                      viewBox='0 0 24 24'
                      aria-hidden='true'
                      focusable='false'
                    >
                      <path d='M2.5 20.5 22 12 2.5 3.5l.1 6.6L16 12l-13.4 1.9z' />
                    </svg>
                  </button>
                </form>
              </section>
            </div>
          )}
        </div>
      </main>
      <Rodape />
    </>
  );
}
