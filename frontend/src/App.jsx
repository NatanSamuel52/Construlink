import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Cabecalho from './componentes-reutilizaveis/Cabecalho/Cabecalho';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';

import Home from './pages/Home/Home.jsx';

import ResultadoDaPesquisa
    from './pages/Resultados/ResultadoDaPesquisa.jsx';

import PerfilPublico
    from './pages/PerfilPublico/PerfilPublico.jsx';

import { obterSessao, limparSessao } from './utils/auth';

import './App.css';


function Painel({ usuario, onLogout, onNavegar }) {
    return (
        <section className="app-painel">
            <div className="app-painel__card">

                <div className="app-painel__status">
                    <span className="app-badge-sucesso">
                        ✓ Sessão Autenticada
                    </span>

                    <span className="app-badge-papel">
                        {usuario?.papel?.toUpperCase()}
                    </span>
                </div>

                <h2 className="app-painel__saudacao">
                    Bem-vindo(a), {usuario?.nome || usuario?.email}!
                </h2>

                <p className="app-painel__descricao">
                    Você acessou com sucesso a função protegida
                    do sistema Construlink V1.0.
                </p>

                <div className="app-painel__detalhes">

                    <div className="app-painel__item">
                        <span className="app-painel__label">
                            ID da Conta:
                        </span>

                        <span className="app-painel__valor">
                            {usuario?.id}
                        </span>
                    </div>

                    <div className="app-painel__item">
                        <span className="app-painel__label">
                            E-mail:
                        </span>

                        <span className="app-painel__valor">
                            {usuario?.email}
                        </span>
                    </div>

                    <div className="app-painel__item">
                        <span className="app-painel__label">
                            Papel no Sistema:
                        </span>

                        <span className="app-painel__valor">
                            {usuario?.papel}
                        </span>
                    </div>

                    {usuario?.cliente_id && (
                        <div className="app-painel__item">
                            <span className="app-painel__label">
                                ID de Cliente:
                            </span>

                            <span className="app-painel__valor">
                                {usuario.cliente_id}
                            </span>
                        </div>
                    )}

                    {usuario?.profissional_id && (
                        <div className="app-painel__item">
                            <span className="app-painel__label">
                                ID de Profissional:
                            </span>

                            <span className="app-painel__valor">
                                {usuario.profissional_id}
                            </span>
                        </div>
                    )}

                </div>

                <div className="app-painel__acoes">

                    <button
                        type="button"
                        className="app-btn-secundario"
                        onClick={() => onNavegar('home')}
                    >
                        Voltar para Início
                    </button>

                    <button
                        type="button"
                        className="app-btn-perigo"
                        onClick={onLogout}
                    >
                        Encerrar Sessão (Sair)
                    </button>

                </div>

            </div>
        </section>
    );
}


function App() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(obterSessao());
    const [alertaProtegido, setAlertaProtegido] = useState(null);

    useEffect(() => {
        setUsuario(obterSessao());
    }, []);

    function handleLoginSucesso(dadosUsuario) {
        setUsuario(dadosUsuario);
        setAlertaProtegido(null);
        navigate('/painel');
    }

    function handleLogout() {
        limparSessao();
        setUsuario(null);
        setAlertaProtegido(null);
        navigate('/');
    }

    function navegarPara(destino) {
        setAlertaProtegido(null);

        if (destino === 'painel' && !usuario) {
            setAlertaProtegido(
                'Acesso restrito: você precisa estar autenticado para acessar esta área protegida.'
            );

            navigate('/login');
            return;
        }

        if (destino === 'home') {
            navigate('/');
            return;
        }

        if (destino === 'login') {
            navigate('/login');
            return;
        }

        if (destino === 'cadastro') {
            navigate('/cadastro');
            return;
        }

        if (destino === 'painel') {
            navigate('/painel');
            return;
        }

        if (destino === 'resultados') {
            navigate('/resultados');
            return;
        }
    }

    return (
        <div className="app-container">

            <Cabecalho
                usuarioAtivo={usuario}
                onNavegar={navegarPara}
                onLogout={handleLogout}
            />

            <main className="app-corpo">

                {alertaProtegido && (
                    <div
                        className="app-aviso-protecao"
                        role="alert"
                    >
                        <span className="app-aviso-protecao__icone">
                            🔒
                        </span>

                        <div className="app-aviso-protecao__conteudo">
                            <strong>Função Protegida:</strong>{' '}
                            {alertaProtegido}
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

                <Routes>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/resultados"
                        element={<ResultadoDaPesquisa />}
                    />

                    <Route
                        path="/perfil-profissional/:id"
                        element={<PerfilPublico />}
                    />

                    <Route
                        path="/login"
                        element={
                            <Login
                                onLoginSucesso={handleLoginSucesso}
                                onNavegar={navegarPara}
                            />
                        }
                    />

                    <Route
                        path="/cadastro"
                        element={
                            <Cadastro
                                onNavegar={navegarPara}
                                onCadastroSucesso={() =>
                                    navegarPara('login')
                                }
                            />
                        }
                    />

                    <Route
                        path="/painel"
                        element={
                            usuario ? (
                                <Painel
                                    usuario={usuario}
                                    onLogout={handleLogout}
                                    onNavegar={navegarPara}
                                />
                            ) : (
                                <Login
                                    onLoginSucesso={handleLoginSucesso}
                                    onNavegar={navegarPara}
                                />
                            )
                        }
                    />

                </Routes>

            </main>
        </div>
    );
}

export default App;