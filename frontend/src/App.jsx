import { Routes, Route } from 'react-router-dom';
import Resultados from './pages/Resultados/ResultadoDaPesquisa.jsx';
import Home from './pages/Home/Home';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resultados" element={<Resultados />} />
      </Routes>
    </>
  );
}

export default App;
