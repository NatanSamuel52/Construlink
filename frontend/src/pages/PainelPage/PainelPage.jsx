import { useState } from "react";
import { obterSessao, limparSessao } from "../../utils/auth";
import "./PainelPage.css";

export default function PainelPage({ onLogout }) {
  const sessao = obterSessao();
  const [confirmando, setConfirmando] = useState(false);

  function handleSair() {
    limparSessao();
    onLogout();
  }

  return (
    <div className="painel-screen">
      <header className="painel-topbar">
        <span className="painel-topbar__logo">Contrulink</span>

        <div className="painel-topbar__user">
          <span className="painel-topbar__email">{sessao?.email}</span>
          <button
            className="painel-topbar__logout"
            onClick={() => setConfirmando(true)}
          >
            Sair
          </button>
        </div>
      </header>

      <main className="painel-main">
        <h1>Bem-vindo(a) de volta!</h1>
        <p>Essa é sua área logada (placeholder até as próximas telas serem implementadas).</p>
      </main>

      {confirmando && (
        <div className="painel-modal__overlay" role="dialog" aria-modal="true">
          <div className="painel-modal">
            <p>Tem certeza que deseja sair?</p>
            <div className="painel-modal__actions">
              <button
                className="painel-modal__cancel"
                onClick={() => setConfirmando(false)}
              >
                Cancelar
              </button>
              <button className="painel-modal__confirm" onClick={handleSair}>
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
