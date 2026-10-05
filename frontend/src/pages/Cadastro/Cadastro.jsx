// Cadastro.jsx - SCRUM-293/294/295/296
import { useState } from 'react';
import './Cadastro.css';

export default function Cadastro({ onNavegar, onCadastroSucesso }) {
  const [papel, setPapel] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [cadastroConcluido, setCadastroConcluido] = useState(false);
  const [nomeRegistrado, setNomeRegistrado] = useState('');

  // Validacao do formulario - SCRUM-296
  function validar() {
    const novosErros = {};

    if (!papel) {
      novosErros.papel = 'Selecione seu tipo de conta.';
    }

    if (!nome.trim()) {
      novosErros.nome = 'Informe seu nome completo.';
    } else if (nome.trim().length < 2) {
      novosErros.nome = 'O nome deve ter pelo menos 2 caracteres.';
    }

    if (!email.trim()) {
      novosErros.email = 'Informe seu e-mail.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      novosErros.email = 'Formato de e-mail invalido.';
    }

    if (!senha) {
      novosErros.senha = 'Informe uma senha.';
    } else if (senha.length < 6) {
      novosErros.senha = 'A senha deve ter pelo menos 6 caracteres.';
    }

    if (!confirmarSenha) {
      novosErros.confirmarSenha = 'Confirme sua senha.';
    } else if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas nao coincidem.';
    }

    return novosErros;
  }

  // Envio do formulario ao backend - SCRUM-295
  async function handleSubmit(e) {
    e.preventDefault();
    const errosValidacao = validar();
    setErros(errosValidacao);

    if (Object.keys(errosValidacao).length > 0) {
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch('http://localhost:3000/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          senha,
          papel,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErros({ geral: dados.mensagem || 'Erro ao realizar cadastro.' });
        return;
      }

      // Cadastro concluido com sucesso
      setNomeRegistrado(dados.usuario.nome);
      setCadastroConcluido(true);

      if (onCadastroSucesso) {
        onCadastroSucesso(dados.usuario);
      }
    } catch (erro) {
      console.error('Erro na requisicao de cadastro:', erro);
      setErros({ geral: 'Nao foi possivel conectar ao servidor. Verifique se o backend esta em execucao.' });
    } finally {
      setCarregando(false);
    }
  }

  // Tela de sucesso apos cadastro
  if (cadastroConcluido) {
    return (
      <div className="cadastro-tela">
        <main className="cadastro-conteudo">
          <div className="cadastro-card">
            <div className="cadastro-sucesso">
              <span className="cadastro-sucesso__icone">✅</span>
              <h1 className="cadastro-sucesso__titulo">Cadastro realizado!</h1>
              <p className="cadastro-sucesso__texto">
                Bem-vindo(a), <strong>{nomeRegistrado}</strong>! Sua conta foi criada com sucesso.
                <br />Agora faca login para acessar a plataforma.
              </p>
              <button
                type="button"
                id="btn-ir-login-pos-cadastro"
                className="cadastro-sucesso__btn"
                onClick={() => onNavegar && onNavegar('login')}
              >
                Ir para o Login
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="cadastro-tela">
      <main className="cadastro-conteudo">
        <form className="cadastro-card" onSubmit={handleSubmit} noValidate>
          <div className="cadastro-card__cabecalho">
            <h1 className="cadastro-card__titulo">Criar sua conta</h1>
            <p className="cadastro-card__subtitulo">
              Junte-se ao Construlink e conecte-se a profissionais ou clientes da sua regiao.
            </p>
          </div>

          {/* Erro geral */}
          {erros.geral && (
            <div className="cadastro-alerta" role="alert">
              <span className="cadastro-alerta__icone">⚠️</span>
              <span>{erros.geral}</span>
            </div>
          )}

          {/* Selecao de papel - SCRUM-294 */}
          <div className="cadastro-papel">
            <span className="cadastro-papel__label">Tipo de conta</span>
            <div className="cadastro-papel__opcoes">
              <button
                type="button"
                id="btn-papel-cliente"
                className={`cadastro-papel__btn ${papel === 'cliente' ? 'cadastro-papel__btn--ativo' : ''}`}
                onClick={() => { setPapel('cliente'); setErros(e => ({ ...e, papel: undefined })); }}
              >
                <span className="cadastro-papel__icone">👤</span>
                <span className="cadastro-papel__nome">Cliente</span>
                <span className="cadastro-papel__descricao">Busco profissionais para servicos</span>
              </button>
              <button
                type="button"
                id="btn-papel-profissional"
                className={`cadastro-papel__btn ${papel === 'profissional' ? 'cadastro-papel__btn--ativo' : ''}`}
                onClick={() => { setPapel('profissional'); setErros(e => ({ ...e, papel: undefined })); }}
              >
                <span className="cadastro-papel__icone">🔨</span>
                <span className="cadastro-papel__nome">Profissional</span>
                <span className="cadastro-papel__descricao">Oferto servicos de reforma</span>
              </button>
            </div>
            {erros.papel && <span className="cadastro-papel__erro">{erros.papel}</span>}
          </div>

          {/* Campo Nome */}
          <div className="cadastro-campo">
            <label htmlFor="cadastro-nome" className="cadastro-campo__label">Nome completo</label>
            <input
              id="cadastro-nome"
              type="text"
              className={`cadastro-campo__input ${erros.nome ? 'cadastro-campo__input--erro' : ''}`}
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
              disabled={carregando}
            />
            {erros.nome && <span className="cadastro-campo__mensagem-erro">{erros.nome}</span>}
          </div>

          {/* Campo Email */}
          <div className="cadastro-campo">
            <label htmlFor="cadastro-email" className="cadastro-campo__label">E-mail</label>
            <input
              id="cadastro-email"
              type="email"
              className={`cadastro-campo__input ${erros.email ? 'cadastro-campo__input--erro' : ''}`}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={carregando}
            />
            {erros.email && <span className="cadastro-campo__mensagem-erro">{erros.email}</span>}
          </div>

          {/* Campo Senha */}
          <div className="cadastro-campo">
            <label htmlFor="cadastro-senha" className="cadastro-campo__label">Senha</label>
            <input
              id="cadastro-senha"
              type="password"
              className={`cadastro-campo__input ${erros.senha ? 'cadastro-campo__input--erro' : ''}`}
              placeholder="Minimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="new-password"
              disabled={carregando}
            />
            {erros.senha && <span className="cadastro-campo__mensagem-erro">{erros.senha}</span>}
          </div>

          {/* Campo Confirmar Senha */}
          <div className="cadastro-campo">
            <label htmlFor="cadastro-confirmar-senha" className="cadastro-campo__label">Confirmar senha</label>
            <input
              id="cadastro-confirmar-senha"
              type="password"
              className={`cadastro-campo__input ${erros.confirmarSenha ? 'cadastro-campo__input--erro' : ''}`}
              placeholder="Repita a senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              autoComplete="new-password"
              disabled={carregando}
            />
            {erros.confirmarSenha && <span className="cadastro-campo__mensagem-erro">{erros.confirmarSenha}</span>}
          </div>

          <button
            id="btn-cadastrar"
            type="submit"
            className="cadastro-btn-enviar"
            disabled={carregando}
          >
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>

          <div className="cadastro-rodape-card">
            <span>Ja possui conta? </span>
            <button
              type="button"
              id="btn-ir-login"
              className="cadastro-link-login"
              onClick={() => onNavegar && onNavegar('login')}
            >
              Entrar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}