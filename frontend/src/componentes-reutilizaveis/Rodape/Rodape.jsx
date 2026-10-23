import { useNavigate } from 'react-router-dom';
import logo from '../Cabecalho/logo-construlink.svg';
import './Rodape.css';

function Rodape() {
  const navigate = useNavigate();

  return (
    <footer id='rodape-construlink' className='rodape'>
      <div className='rodape-identidade'>
        <img src={logo} alt='Construlink' />
        <p>Conectando quem constrói</p>
      </div>

      <div className='rodape-navegacao'>
        <a
          href='/'
          onClick={(event) => {
            event.preventDefault();
            navigate('/');
          }}
        >
          Home
        </a>

        <a
          href='/sobre'
          onClick={(event) => {
            event.preventDefault();
            navigate('/sobre');
          }}
        >
          Sobre Nós
        </a>

        <a
          href='/como-funciona'
          onClick={(event) => {
            event.preventDefault();
            navigate('/como-funciona');
          }}
        >
          Como funciona
        </a>
      </div>

      <div className='rodape-mensagem'>
        <p>
          Construindo conexões
          <br />
          para um futuro melhor
        </p>
      </div>
    </footer>
  );
}

export default Rodape;
