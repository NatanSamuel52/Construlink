import { useState } from "react";
import LoginPage from "./pages/LoginPage/LoginPage";
import PainelPage from "./pages/PainelPage/PainelPage";
import { obterSessao } from "./utils/auth";

function App() {
  const [autenticado, setAutenticado] = useState(Boolean(obterSessao()));

  if (autenticado) {
    return <PainelPage onLogout={() => setAutenticado(false)} />;
  }

  return <LoginPage onLoginSuccess={() => setAutenticado(true)} />;
}

export default App;
