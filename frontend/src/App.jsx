import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home.jsx';

import ResultadoDaPesquisa
    from './pages/Resultados/ResultadoDaPesquisa.jsx';

import PerfilPublico
    from './pages/PerfilPublico/PerfilPublico.jsx';

function App() {

    return (
        <Routes>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/resultados"
                element={<ResultadoDaPesquisa />}
            />

            <Route
                path="/perfil-profissional/:id"
                element={<PerfilPublico />}
            />

        </Routes>
    );
}

export default App;