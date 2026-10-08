import BarraPesquisaHome from "./BarraPesquisaTelaHome/BarraPesquisaHome";
import CardProfissionaisDisponiveis from "../../componentes-reutilizaveis/CardProfissionaisDisponiveis/CardProfissionaisDisponiveis.jsx";
import ComoFunciona from '../../componentes-reutilizaveis/ComoFunciona/ComoFunciona.jsx';
import Rodape from '../../componentes-reutilizaveis/Rodape/Rodape.jsx';
import './Home.css';
function Home() {
  return (
    <>
      <BarraPesquisaHome />
      <CardProfissionaisDisponiveis />
      <ComoFunciona />
      <Rodape />
    </>
  );
}
export default Home;