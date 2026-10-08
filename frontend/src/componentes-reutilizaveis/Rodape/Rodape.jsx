import logo from '../Cabecalho/logo-construlink.svg';
import './Rodape.css';

function Rodape() {
    return (
        <footer className="rodape">

            <div className="rodape-identidade">
                <img src={logo} alt="Construlink" />
                <p>Conectando quem constrói</p>
            </div>

            <div className="rodape-navegacao">
                <a href="#">Home</a>
                <a href="#">Sobre nós</a>
                <a href="#">Como funciona</a>
                <a href="#">Ajuda❔</a>
            </div>

            <div className="rodape-mensagem">
                <p>
                    Construindo conexões<br />
                    para um futuro melhor
                </p>
            </div>

        </footer>
    );
}

export default Rodape;