import { useState, useEffect } from 'react';
import Cabecalho from './componentes-reutilizaveis/Cabecalho/Cabecalho';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import { obterSessao, limparSessao } from './utils/auth';
import './App.css';

export default function App() {
  const [usuario, setUsuario] = useState(obterSessao());
  const [tela, setTela] = useState('home');
  const [alertaProtegido, setAlertaProtegido] = useState(null);

  useEffect(() => {
    // Sincroniza o estado da sessão
    setUsuario(obterSessao());
  }, []);

  function handleLoginSucesso(dadosUsuario) {
    setUsuario(dadosUsuario);
    setAlertaProtegido(null);
    setTela('painel');
  }

  function handleLogout() {
    limparSessao();
    setUsuario(null);
    setTela('home');
  }

  function navegarPara(destino) {
    setAlertaProtegido(null);

    // Validação de acesso a funções protegidas (Critério de Aceite)
    if (destino === 'painel' && !usuario) {
      setAlertaProtegido('Acesso restrito: você precisa estar autenticado para acessar esta área protegida.');
      setTela('login');
      return;
    }

    setTela(destino);
  }

  return (
    <div className="app-container">
      {/* Cabeçalho que alterna dinamicamente conforme estado de autenticação */}
      <Cabecalho
        usuarioAtivo={usuario}
        onNavegar={navegarPara}
        onLogout={handleLogout}
      />

      <main className="app-corpo">
        {alertaProtegido && (
          <div className="app-aviso-protecao" role="alert">
            <span className="app-aviso-protecao__icone">🔒</span>
            <div className="app-aviso-protecao__conteudo">
              <strong>Função Protegida:</strong> {alertaProtegido}
            </div>
            <button
              type="button"
              className="app-aviso-protecao__fechar"
              onClick={() => setAlertaProtegido(null)}
            >
              ✕
            </button>
          </div>
        )}

        {tela === 'home' && (
          <section className="app-home">
            <div className="app-home__hero">
              <span className="app-home__tag">FEMF 2026 • FACESM</span>
              <h1 className="app-home__titulo">Conectando você aos melhores profissionais de reforma</h1>
              <p className="app-home__subtitulo">
                Pesquise eletricistas, encanadores, pintores e marceneiros em Itajubá sem precisar de cadastro.
              </p>

              <div className="app-home__acoes">
                <button
                  type="button"
                  className="app-btn-principal"
                  onClick={() => navegarPara('painel')}
                >
                  {usuario ? 'Acessar Meu Painel' : 'Testar Área Protegida'}
                </button>
                {!usuario && (
                  <button
                    type="button"
                    className="app-btn-secundario"
                    onClick={() => navegarPara('login')}
                  >
                    Fazer Login
                  </button>
                )}
              </div>
            </div>

            <div className="app-home__cards">
              <div className="app-feature-card">
                <span className="app-feature-card__icone">🔍</span>
                <h3>Busca Pública</h3>
                <p>Navegue por serviços e profissionais livremente sem login.</p>
              </div>

              <div className="app-feature-card">
                <span className="app-feature-card__icone">🛡️</span>
                <h3>Área Segura</h3>
                <p>Autenticação protegida para Clientes e Profissionais com senha criptografada.</p>
              </div>

              <div className="app-feature-card">
                <span className="app-feature-card__icone">💬</span>
                <h3>Comunicação Direta</h3>
                <p>Inicie conversas e negocie manutenções diretamente com os prestadores.</p>
              </div>
            </div>
          </section>
        )}

        
        {tela === 'cadastro' && (
          <Cadastro
            onNavegar={navegarPara}
            onCadastroSucesso={() => navegarPara('login')}
          />
        )}

        {tela === 'login' && (
          <Login
            onLoginSucesso={handleLoginSucesso}
            onNavegar={navegarPara}
          />
        )}

        {tela === 'painel' && (
          <section className="app-painel">
            <div className="app-painel__card">
              <div className="app-painel__status">
                <span className="app-badge-sucesso">✓ Sessão Autenticada</span>
                <span className="app-badge-papel">{usuario?.papel?.toUpperCase()}</span>
              </div>

              <h2 className="app-painel__saudacao">
                Bem-vindo(a), {usuario?.nome || usuario?.email}!
              </h2>
              <p className="app-painel__descricao">
                Você acessou com sucesso a função protegida do sistema Construlink V1.0.
              </p>

              <div className="app-painel__detalhes">
                <div className="app-painel__item">
                  <span className="app-painel__label">ID da Conta:</span>
                  <span className="app-painel__valor">{usuario?.id}</span>
                </div>
                <div className="app-painel__item">
                  <span className="app-painel__label">E-mail:</span>
                  <span className="app-painel__valor">{usuario?.email}</span>
                </div>
                <div className="app-painel__item">
                  <span className="app-painel__label">Papel no Sistema:</span>
                  <span className="app-painel__valor">{usuario?.papel}</span>
                </div>
                {usuario?.cliente_id && (
                  <div className="app-painel__item">
                    <span className="app-painel__label">ID de Cliente:</span>
                    <span className="app-painel__valor">{usuario.cliente_id}</span>
                  </div>
                )}
                {usuario?.profissional_id && (
                  <div className="app-painel__item">
                    <span className="app-painel__label">ID de Profissional:</span>
                    <span className="app-painel__valor">{usuario.profissional_id}</span>
                  </div>
                )}
              </div>

              <div className="app-painel__acoes">
                <button
                  type="button"
                  className="app-btn-secundario"
                  onClick={() => navegarPara('home')}
                >
                  Voltar para Início
                </button>
                <button
                  type="button"
                  className="app-btn-perigo"
                  onClick={handleLogout}
                >
                  Encerrar Sessão (Sair)
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
