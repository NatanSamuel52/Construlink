import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Rodape from '../../componentes-reutilizaveis/Rodape/Rodape.jsx';
import { obterSessao } from '../../utils/auth.js';
import {
  iniciarConversa,
  buscarConversa,
  buscarMensagens,
  enviarMensagem,
} from '../../servicos/api.js';
import './Contato.css';

export default function Contato() {
  const { id } = useParams(); // Pode ser profissionalId ou conversaId
  const [searchParams] = useSearchParams();
  const servicoIdQuery = searchParams.get('servicoId');
  const navigate = useNavigate();

  const [usuario] = useState(obterSessao());
  const [conversa, setConversa] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const fimMensagensRef = useRef(null);

  // Rola automaticamente para o fim da lista de mensagens
  useEffect(() => {
    fimMensagensRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  // Carrega ou inicia a conversa
  useEffect(() => {
    if (!usuario?.token) {
      setCarregando(false);
      return;
    }

    let ativo = true;

    async function carregarDados() {
      setCarregando(true);
      setErro('');

      try {
        let dadosConversa;

        // Se a rota for por conversaId direto ou por profissionalId
        if (searchParams.get('tipo') === 'conversa') {
          dadosConversa = await buscarConversa(usuario.token, id);
        } else {
          // Inicia ou recupera a conversa existente com este profissional
          dadosConversa = await iniciarConversa(usuario.token, {
            profissional_id: Number(id),
            servico_id: servicoIdQuery ? Number(servicoIdQuery) : undefined,
          });
        }

        if (ativo) {
          setConversa(dadosConversa);

          const msgs = await buscarMensagens(usuario.token, dadosConversa.id);
          if (ativo) {
            setMensagens(msgs);
          }
        }
      } catch (err) {
        if (ativo) {
          console.error('Erro ao carregar conversa:', err);
          setErro(err.message || 'Não foi possível carregar a conversa.');
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarDados();

    // Polling leve a cada 4 segundos para atualizar novas mensagens
    const intervalo = setInterval(async () => {
      if (conversa?.id && usuario?.token) {
        try {
          const msgsAtualizadas = await buscarMensagens(usuario.token, conversa.id);
          setMensagens(msgsAtualizadas);
        } catch (e) {
          // Ignora erro em segundo plano
        }
      }
    }, 4000);

    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [id, servicoIdQuery, usuario]);

  async function handleEnviar(e) {
    e.preventDefault();

    const texto = novaMensagem.trim();
    if (!texto || !conversa?.id || enviando) return;

    setEnviando(true);
    setErro('');

    try {
      const msgEnviada = await enviarMensagem(usuario.token, conversa.id, texto);
      setMensagens((prev) => [...prev, msgEnviada]);
      setNovaMensagem('');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setErro(err.message || 'Erro ao enviar a mensagem.');
    } finally {
      setEnviando(false);
    }
  }

  function voltar() {
    if (id) {
      navigate(`/perfil-profissional/${id}`);
    } else {
      navigate(-1);
    }
  }

  if (!usuario) {
    return (
      <>
        <main className="pagina-contato">
          <div className="contato-container">
            <button type="button" className="contato-voltar" onClick={() => navigate(-1)}>
              ← Voltar
            </button>
            <div className="contato-chat-card" style={{ padding: '40px', textAlign: 'center' }}>
              <h2>Identificação Necessária</h2>
              <p style={{ color: '#94a3b8', margin: '16px 0 24px' }}>
                Para enviar uma mensagem e iniciar um contato com o profissional, você precisa estar autenticado.
              </p>
              <button
                type="button"
                className="contato-btn-enviar"
                style={{ padding: '12px 24px', alignSelf: 'center' }}
                onClick={() => navigate('/login')}
              >
                Fazer Login / Cadastrar
              </button>
            </div>
          </div>
        </main>
        <Rodape />
      </>
    );
  }

  if (carregando) {
    return (
      <>
        <main className="pagina-contato">
          <div className="contato-container">
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Carregando conversa...</p>
          </div>
        </main>
        <Rodape />
      </>
    );
  }

  return (
    <>
      <main className="pagina-contato">
        <div className="contato-container">
          <button type="button" className="contato-voltar" onClick={voltar}>
            ← Voltar para o perfil
          </button>

          {erro && (
            <div className="contato-alerta-erro" role="alert">
              {erro}
            </div>
          )}

          {/* Dados do Profissional */}
          <section className="contato-card-profissional">
            {conversa?.profissional_foto_url ? (
              <img
                src={conversa.profissional_foto_url}
                alt={`Foto de ${conversa.profissional_nome}`}
                className="contato-foto-perfil"
              />
            ) : (
              <div className="contato-foto-placeholder">👤</div>
            )}

            <div className="contato-info-profissional">
              <h1>{conversa?.profissional_nome || 'Profissional'}</h1>
              {conversa?.profissional_descricao && (
                <p>{conversa.profissional_descricao}</p>
              )}
              {conversa?.servico_nome && (
                <span className="contato-badge-servico">
                  Serviço: {conversa.servico_nome}
                </span>
              )}
            </div>
          </section>

          {/* Área do Chat */}
          <section className="contato-chat-card">
            <header className="contato-chat-cabecalho">
              <span>Mensagens do Atendimento</span>
              <span className="contato-chat-status">Ativo</span>
            </header>

            <div className="contato-mensagens-lista">
              {mensagens.length === 0 ? (
                <div className="contato-vazio">
                  <span>💬</span>
                  <p>Inicie a conversa! Apresente sua necessidade e tire dúvidas sobre o serviço.</p>
                </div>
              ) : (
                mensagens.map((msg) => {
                  const eMinha = msg.remetente_usuario_id === usuario.id;
                  const dataFormatada = msg.enviada_em
                    ? new Date(msg.enviada_em).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '';

                  return (
                    <div
                      key={msg.id}
                      className={`contato-mensagem ${
                        eMinha ? 'contato-mensagem-minha' : 'contato-mensagem-outra'
                      }`}
                    >
                      <span className="contato-mensagem-remetente">
                        {eMinha ? 'Você' : msg.remetente_nome || 'Profissional'}
                      </span>
                      <div className="contato-mensagem-balao">{msg.conteudo}</div>
                      {dataFormatada && (
                        <span className="contato-mensagem-hora">{dataFormatada}</span>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={fimMensagensRef} />
            </div>

            <form className="contato-form-envio" onSubmit={handleEnviar}>
              <input
                type="text"
                className="contato-input-mensagem"
                placeholder="Digite sua mensagem para o profissional..."
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                disabled={enviando}
              />
              <button
                type="submit"
                className="contato-btn-enviar"
                disabled={enviando || !novaMensagem.trim()}
              >
                {enviando ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </section>
        </div>
      </main>

      <Rodape />
    </>
  );
}
