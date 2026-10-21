import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { obterSessao, limparSessao } from '../../utils/auth';
import { buscarConversasNaoLidas } from '../../servicos/api';
import './Cabecalho.css';
import logo from './logo-construlink.svg';

export default function Cabecalho({ onNavegar, usuarioAtivo, onLogout }) {
  const usuario = usuarioAtivo || obterSessao();
  const [modalSair, setModalSair] = useState(false);
  const [temMensagensNaoLidas, setTemMensagensNaoLidas] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!usuario?.token) {
      return undefined;
    }

    let ativo = true;

    async function verificarMensagensNaoLidas() {
      try {
        const temNaoLidas = await buscarConversasNaoLidas(usuario.token);

        if (ativo) {
          setTemMensagensNaoLidas(temNaoLidas);
        }
      } catch (erro) {
        if (ativo) {
          console.error('Erro ao verificar mensagens não lidas:', erro);
        }
      }
    }

    verificarMensagensNaoLidas();
    const intervalo = window.setInterval(verificarMensagensNaoLidas, 15000);

    return () => {
      ativo = false;
      window.clearInterval(intervalo);
    };
  }, [pathname, usuario?.token]);

  function classeLink(caminho) {
    return `cabecalho__link${pathname === caminho ? ' cabecalho__link--ativo' : ''}`;
  }

  function confirmarSaida() {
    limparSessao();
    setModalSair(false);

    if (onLogout) {
      onLogout();
    }
  }

  return (
    <header className='cabecalho'>
      <div className='cabecalho__container'>
        <button
          type='button'
          className='cabecalho__marca'
          onClick={() => onNavegar && onNavegar('home')}
          aria-label='Ir para a página inicial'
        >
          <img
            src={logo}
            alt='Logo Construlink'
            className='cabecalho__logo-imagem'
          />
        </button>

        <nav className='cabecalho__nav'>
          <button
            type='button'
            className={classeLink('/')}
            aria-current={pathname === '/' ? 'page' : undefined}
            onClick={() => onNavegar && onNavegar('home')}
          >
            Home
          </button>

          <button
            type='button'
            className={classeLink('/sobre')}
            aria-current={pathname === '/sobre' ? 'page' : undefined}
            onClick={() => onNavegar && onNavegar('sobre')}
          >
            Sobre Nós
          </button>

          <button
            type='button'
            className={classeLink('/como-funciona')}
            aria-current={pathname === '/como-funciona' ? 'page' : undefined}
            onClick={() => onNavegar && onNavegar('como-funciona')}
          >
            Como funciona
          </button>
        </nav>
        {usuario?.papel === 'profissional' && (
          <button
            type='button'
            className='cabecalho__link'
            onClick={() => onNavegar && onNavegar('meu-perfil-profissional')}
          >
            Meu perfil
          </button>
        )}
        <div className='cabecalho__acoes'>
          {usuario && (
            <button
              type='button'
              className='cabecalho__link cabecalho__link--mensagens'
              onClick={() => onNavegar && onNavegar('mensagens')}
              aria-label={`Mensagens${temMensagensNaoLidas ? ', há mensagens não lidas' : ''}`}
            >
              Mensagens
              {temMensagensNaoLidas && (
                <span
                  className='cabecalho__mensagens-nao-lidas'
                  aria-hidden='true'
                />
              )}
            </button>
          )}
          {usuario ? (
            <div className='cabecalho__usuario'>
              <div className='cabecalho__avatar'>
                {usuario.foto_perfil_url ? (
                  <img
                    src={usuario.foto_perfil_url}
                    alt={usuario.nome}
                    className='cabecalho__avatar-img'
                  />
                ) : (
                  <span className='cabecalho__avatar-letra'>
                    {usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>

              <div className='cabecalho__info'>
                <span className='cabecalho__nome'>
                  {usuario.nome || usuario.email}
                </span>

                <span className='cabecalho__papel'>
                  {usuario.papel || 'Usuário'}
                </span>
              </div>

              <button
                type='button'
                className='cabecalho__btn-sair'
                onClick={() => setModalSair(true)}
                title='Encerrar sessão'
              >
                Sair
              </button>
            </div>
          ) : (
            <div className='cabecalho__botoes-auth'>
              <button
                type='button'
                className='cabecalho__btn-entrar'
                onClick={() => onNavegar && onNavegar('login')}
              >
                Entrar
              </button>

              <button
                type='button'
                className='cabecalho__btn-cadastrar'
                onClick={() => onNavegar && onNavegar('cadastro')}
              >
                Cadastrar
              </button>
            </div>
          )}
        </div>
      </div>

      {modalSair && (
        <div
          className='cabecalho-modal__overlay'
          role='dialog'
          aria-modal='true'
        >
          <div className='cabecalho-modal'>
            <h3 className='cabecalho-modal__titulo'>Encerrar Sessão</h3>

            <p className='cabecalho-modal__mensagem'>
              Tem certeza de que deseja sair da sua conta no Construlink?
            </p>

            <div className='cabecalho-modal__acoes'>
              <button
                type='button'
                className='cabecalho-modal__btn-cancelar'
                onClick={() => setModalSair(false)}
              >
                Cancelar
              </button>

              <button
                type='button'
                className='cabecalho-modal__btn-confirmar'
                onClick={confirmarSaida}
              >
                Sim, sair
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
