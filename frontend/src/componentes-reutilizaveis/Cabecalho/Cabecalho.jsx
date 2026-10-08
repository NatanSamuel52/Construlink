import { useState } from 'react';
import { obterSessao, limparSessao } from '../../utils/auth';
import './Cabecalho.css';

export default function Cabecalho({ onNavegar, usuarioAtivo, onLogout }) {
  const usuario = usuarioAtivo || obterSessao();
  const [modalSair, setModalSair] = useState(false);

  function confirmarSaida() {
    limparSessao();
    setModalSair(false);
    if (onLogout) {
      onLogout();
    }
  }

  return (
    <header className="cabecalho">
      <div className="cabecalho__container">
        <div className="cabecalho__marca" onClick={() => onNavegar && onNavegar('home')} role="button" tabIndex={0}>
          <span className="cabecalho__logo">Contrulink</span>
        </div>

        <nav className="cabecalho__nav">
          <button
            type="button"
            className="cabecalho__link"
            onClick={() => onNavegar && onNavegar('home')}
          >
            Início
          </button>
          <button
            type="button"
            className="cabecalho__link"
            onClick={() => onNavegar && onNavegar('resultados')}
          >
            Serviços
          </button>
        </nav>

        <div className="cabecalho__acoes">
          {usuario ? (
            <div className="cabecalho__usuario">
              <div className="cabecalho__avatar">
                {usuario.foto_perfil_url ? (
                  <img src={usuario.foto_perfil_url} alt={usuario.nome} className="cabecalho__avatar-img" />
                ) : (
                  <span className="cabecalho__avatar-letra">
                    {usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>

              <div className="cabecalho__info">
                <span className="cabecalho__nome">{usuario.nome || usuario.email}</span>
                <span className="cabecalho__papel">{usuario.papel || 'Usuário'}</span>
              </div>

              <button
                type="button"
                className="cabecalho__btn-sair"
                onClick={() => setModalSair(true)}
                title="Encerrar sessão"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="cabecalho__botoes-auth">
              <button
                type="button"
                className="cabecalho__btn-entrar"
                onClick={() => onNavegar && onNavegar('login')}
              >
                Entrar
              </button>
              <button
                type="button"
                className="cabecalho__btn-cadastrar"
                onClick={() => onNavegar && onNavegar('cadastro')}
              >
                Cadastrar
              </button>
            </div>
          )}
        </div>
      </div>

      {modalSair && (
        <div className="cabecalho-modal__overlay" role="dialog" aria-modal="true">
          <div className="cabecalho-modal">
            <h3 className="cabecalho-modal__titulo">Encerrar Sessão</h3>
            <p className="cabecalho-modal__mensagem">
              Tem certeza de que deseja sair da sua conta no Contrulink?
            </p>
            <div className="cabecalho-modal__acoes">
              <button
                type="button"
                className="cabecalho-modal__btn-cancelar"
                onClick={() => setModalSair(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="cabecalho-modal__btn-confirmar"
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
