import Cabecalho from '../../componentes-reutilizaveis/Cabecalho/Cabecalho.jsx';
import BarraPesquisaHome from "./BarraPesquisaTelaHome/BarraPesquisaHome";
import CardProfissionaisDisponiveis from "../../componentes-reutilizaveis/CardProfissionaisDisponiveis/CardProfissionaisDisponiveis.jsx";
import './Home.css';
import ComoFunciona from '../../componentes-reutilizaveis/ComoFunciona/ComoFunciona.jsx';
function Home() {
  return (
    <>
      <Cabecalho />
      <BarraPesquisaHome />
      <CardProfissionaisDisponiveis />
      <ComoFunciona />
    </>
  );
}
export default Home;