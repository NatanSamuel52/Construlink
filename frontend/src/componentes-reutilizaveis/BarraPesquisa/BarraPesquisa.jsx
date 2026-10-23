import { useState } from 'react';
import './BarraPesquisa.css';

function BarraPesquisa({ onBuscar }) {
  const [campoPesquisa, setCampoPesquisa] = useState('');

  function enviarPesquisa(event) {
    event.preventDefault();
    onBuscar(campoPesquisa);
  }

  return (
    <form className='barra-pesquisa' onSubmit={enviarPesquisa}>
      <input
        type='search'
        value={campoPesquisa}
        onChange={(event) => setCampoPesquisa(event.target.value)}
        placeholder='Qual serviço você está procurando?'
        aria-label='Qual serviço você está procurando?'
      />

      <button type='submit'>Buscar</button>
    </form>
  );
}

export default BarraPesquisa;