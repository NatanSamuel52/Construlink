import { useState } from 'react';
import { salvarSessao } from '../../utils/auth';
import './Login.css';

export default function Login({ onLoginSucesso, onNavegar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);

  function validar() {
    const novosErros = {};
    if (!email.trim()) {
      novosErros.email = 'Informe seu e-mail.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      novosErros.email = 'Formato de e-mail inválido.';
    }

    if (!senha) {
      novosErros.senha = 'Informe sua senha.';
    } else if (senha.length < 6) {
      novosErros.senha = 'A senha deve conter ao menos 6 caracteres.';
    }

    return novosErros;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errosValidacao = validar();
    setErros(errosValidacao);

    if (Object.keys(errosValidacao).length > 0) {
      return;
    }

    setCarregando(true);
    setErros({});

    try {
      const resposta = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErros({ geral: dados.mensagem || 'Credenciais inválidas. Verifique seu e-mail e senha.' });
        return;
      }

      // Autenticação com sucesso
      salvarSessao(dados.usuario);

      if (onLoginSucesso) {
        onLoginSucesso(dados.usuario);
      }
    } catch (erro) {
      console.error('Erro na requisição de login:', erro);
      setErros({ geral: 'Não foi possível conectar ao servidor. Verifique se o backend está em execução.' });
    } finally {
      setCarregando(false);
    }
  }

  function preencherContaTeste(emailTeste, senhaTeste) {
    setEmail(emailTeste);
    setSenha(senhaTeste);
    setErros({});
  }

  return (
    <div className="login-tela">
      <main className="login-conteudo">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div className="login-card__cabecalho">
            <h1 className="login-card__titulo">Entrar na sua conta</h1>
            <p className="login-card__subtitulo">
              Acesse a plataforma Construlink para gerenciar seus serviços ou entrar em contato.
            </p>
          </div>

          {erros.geral && (
            <div className="login-alerta" role="alert">
              <span className="login-alerta__icone">⚠️</span>
              <span>{erros.geral}</span>
            </div>
          )}

          <div className="login-campo">
            <label htmlFor="email" className="login-campo__label">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className={`login-campo__input ${erros.email ? 'login-campo__input--erro' : ''}`}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={carregando}
            />
            {erros.email && <span className="login-campo__mensagem-erro">{erros.email}</span>}
          </div>

          <div className="login-campo">
            <label htmlFor="senha" className="login-campo__label">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              className={`login-campo__input ${erros.senha ? 'login-campo__input--erro' : ''}`}
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              disabled={carregando}
            />
            {erros.senha && <span className="login-campo__mensagem-erro">{erros.senha}</span>}
          </div>

          <button type="submit" className="login-btn-enviar" disabled={carregando}>
            {carregando ? 'Validando credenciais...' : 'Entrar'}
          </button>

          <div className="login-rodape-card">
            <span>Não possui conta? </span>
            <button
              type="button"
              className="login-link-cadastro"
              onClick={() => onNavegar && onNavegar('cadastro')}
            >
              Cadastre-se
            </button>
          </div>

          {/* Atalhos para testes da avaliação */}
          <div className="login-teste-atalhos">
            <span className="login-teste-atalhos__titulo">Acesso rápido para testes (FEMF):</span>
            <div className="login-teste-atalhos__botoes">
              <button
                type="button"
                className="login-teste-btn"
                onClick={() => preencherContaTeste('ana.silva.teste@construlink.local', '123456')}
              >
                👤 Cliente (Ana)
              </button>
              <button
                type="button"
                className="login-teste-btn"
                onClick={() => preencherContaTeste('carlos.oliveira.teste@construlink.local', '123456')}
              >
                🔨 Profissional (Carlos)
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
