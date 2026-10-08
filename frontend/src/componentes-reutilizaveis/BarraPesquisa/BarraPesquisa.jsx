import { useState } from 'react';
import './BarraPesquisa.css';

function BarraPesquisa({ onBuscar }) {

    const [campoPesquisa, setCampoPesquisa] = useState('');

    return (
        <div className="barra-pesquisa">
            <input
                type="text"
                value={campoPesquisa}
                onChange={(event) => {
                    setCampoPesquisa(event.target.value);
                }}
                placeholder="Qual serviço você está procurando?"
            />

            <button onClick={() => onBuscar(campoPesquisa)}>
                Buscar
            </button>
        </div>
    );
}

export default BarraPesquisa;