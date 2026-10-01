import { useState } from "react";
import LoginPage from "./pages/Home-Index/LoginPage";
import PainelPage from "./pages/Resultaddos/PainelPage";
import { obterSessao } from "./utils/auth";

function App() {
  const [autenticado, setAutenticado] = useState(Boolean(obterSessao()));

  if (autenticado) {
    return <PainelPage onLogout={() => setAutenticado(false)} />;
  }

  return <LoginPage onLoginSuccess={() => setAutenticado(true)} />;
}

export default App;
