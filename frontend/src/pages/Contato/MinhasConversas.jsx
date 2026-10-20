import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Rodape from '../../componentes-reutilizaveis/Rodape/Rodape.jsx';
import { buscarMinhasConversas } from '../../servicos/api.js';
import { obterSessao } from '../../utils/auth.js';
import './Contato.css';

function Avatar({ nome, foto }) {
  if (foto) {
    return (
      <img
        className='mensagens-item-avatar'
        src={foto}
        alt={`Foto de ${nome}`}
      />
    );
  }

  return (
    <span className='mensagens-item-avatar contato-avatar-placeholder' aria-hidden='true'>
      {nome?.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );
}

function formatarData(data) {
  if (!data) {
    return '';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(data));
}

export default function MinhasConversas() {
  const navigate = useNavigate();
  const usuario = obterSessao();
  const [conversas, setConversas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregarConversas() {
      setCarregando(true);
      setErro('');

      try {
        const resultado = await buscarMinhasConversas(usuario?.token);
        if (ativo) {
          setConversas(resultado);
        }
      } catch (erroConsulta) {
        if (ativo) {
          console.error('Erro ao consultar conversas:', erroConsulta);
          setErro(erroConsulta.message || 'Não foi possível carregar as conversas.');
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarConversas();

    return () => {
      ativo = false;
    };
  }, [tentativa, usuario?.token]);

  function abrirConversa(conversaId) {
    navigate(`/contato/${conversaId}?tipo=conversa`);
  }

  return (
    <>
      <main className='pagina-mensagens'>
        <div className='mensagens-container'>
          <button
            type='button'
            className='mensagens-voltar'
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>

          <h1 className='mensagens-titulo'>Minhas mensagens</h1>
          <p className='mensagens-introducao'>
            Acompanhe suas conversas com clientes e profissionais.
          </p>

          {carregando ? (
            <div className='mensagens-estado' role='status'>
              Carregando conversas...
            </div>
          ) : erro ? (
            <div className='mensagens-estado' role='alert'>
              <p>{erro}</p>
              <button
                type='button'
                className='mensagens-recarregar'
                onClick={() => setTentativa((atual) => atual + 1)}
              >
                Tentar novamente
              </button>
            </div>
          ) : conversas.length === 0 ? (
            <div className='mensagens-estado'>
              Você ainda não tem conversas.
            </div>
          ) : (
            <div className='mensagens-lista'>
              {conversas.map((conversa) => {
                const souCliente =
                  String(conversa.cliente_usuario_id) === String(usuario?.id);
                const outraPessoa = souCliente
                  ? {
                      nome: conversa.profissional_nome,
                      foto: conversa.profissional_foto_url,
                    }
                  : {
                      nome: conversa.cliente_nome,
                      foto: conversa.cliente_foto_url,
                    };

                return (
                  <button
                    key={conversa.id}
                    type='button'
                    className='mensagens-item'
                    onClick={() => abrirConversa(conversa.id)}
                  >
                    <Avatar nome={outraPessoa.nome} foto={outraPessoa.foto} />
                    <span className='mensagens-item-conteudo'>
                      <span className='mensagens-item-topo'>
                        <strong>{outraPessoa.nome || 'Contato'}</strong>
                        <time>
                          {formatarData(
                            conversa.ultima_mensagem_em || conversa.criado_em,
                          )}
                        </time>
                      </span>
                      <span className='mensagens-item-servico'>
                        {conversa.servico_nome}
                      </span>
                      <span className='mensagens-item-ultima'>
                        {conversa.ultima_mensagem ||
                          'Conversa iniciada. Envie uma mensagem para começar.'}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Rodape />
    </>
  );
}
