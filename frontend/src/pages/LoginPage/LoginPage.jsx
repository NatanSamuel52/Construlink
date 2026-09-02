import { useState } from "react";
import "./LoginPage.css";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  function validar() {
    const novosErros = {};
    if (!email.trim()) {
      novosErros.email = "Informe seu e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      novosErros.email = "E-mail inválido.";
    }
    if (!senha) {
      novosErros.senha = "Informe sua senha.";
    } else if (senha.length < 6) {
      novosErros.senha = "A senha precisa ter pelo menos 6 caracteres.";
    }
    return novosErros;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const novosErros = validar();
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    try {
      // Mock temporário — substituir pela chamada real ao backend (SCRUM-158)
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Login simulado com sucesso:", { email });
    } catch (err) {
      setErros({ geral: "Não foi possível entrar. Tente novamente." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login-screen">
      <header className="login-topbar">
        <span className="login-topbar__logo">Contrulink</span>
        <a className="login-topbar__link" href="/cadastro">
          Não tem conta? <strong>Cadastrar</strong>
        </a>
      </header>

      <main className="login-main">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <h1 className="login-card__title">Entrar na sua conta</h1>
          <p className="login-card__subtitle">
            Acesse para gerenciar seu portfólio ou encontrar um profissional.
          </p>

          {erros.geral && (
            <div className="login-card__alert" role="alert">
              {erros.geral}
            </div>
          )}

          <label className="login-field" htmlFor="email">
            E-mail
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(erros.email)}
              aria-describedby={erros.email ? "email-erro" : undefined}
              autoComplete="email"
            />
            {erros.email && (
              <span className="login-field__erro" id="email-erro">
                {erros.email}
              </span>
            )}
          </label>

          <label className="login-field" htmlFor="senha">
            Senha
            <input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              aria-invalid={Boolean(erros.senha)}
              aria-describedby={erros.senha ? "senha-erro" : undefined}
              autoComplete="current-password"
            />
            {erros.senha && (
              <span className="login-field__erro" id="senha-erro">
                {erros.senha}
              </span>
            )}
          </label>

          <button type="submit" className="login-card__cta" disabled={enviando}>
            {enviando ? "Entrando..." : "Entrar"}
          </button>

          <a className="login-card__forgot" href="/recuperar-senha">
            Esqueci minha senha
          </a>
        </form>
      </main>
    </div>
  );
}
