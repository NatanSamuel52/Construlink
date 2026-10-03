import Cabecalho from '../../componentes-reutilizaveis/Cabecalho/Cabecalho.jsx';
import BarraPesquisaHome from "./BarraPesquisaTelaHome/BarraPesquisaHome";
import CardProfissionaisDisponiveis from "../../componentes-reutilizaveis/CardProfissionaisDisponiveis/CardProfissionaisDisponiveis.jsx";
import './Home.css';
function Home() {
  return (
    <>
      <Cabecalho />
      <BarraPesquisaHome />
      <CardProfissionaisDisponiveis />
    </>
  );
}
export default Home;