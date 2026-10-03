import logo from './logo-construlink.svg';
import './Cabecalho.css';

function Cabecalho() {
    return (
        <header className="cabecalho">
            <div className="logo">
                <a href="#">
                    <img src={logo} alt="Logo Construlink" />
                </a>
            </div>
            <div className="area-navegacao">
                <nav className="menu">
                    <a href="#">Início</a>
                    <a href="#">Serviços</a>
                    <a href="#">Sobre</a>
                    <a href="#">Como funciona</a>
                    <a href="#">Ajuda ⌕</a>
                </nav>

                <button className="botao-entrar">
                    Entrar
                </button>
                <button className="botao-cadastrar">
                    Cadastrar
                </button>
            </div>
        </header>
    );
}

export default Cabecalho;