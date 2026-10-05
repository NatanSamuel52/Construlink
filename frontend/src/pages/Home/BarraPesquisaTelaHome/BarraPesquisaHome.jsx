import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarServicos, buscarProfissionais } from '../../../servicos/api';
import fundoHome from '../BarraPesquisaTelaHome/fundoHome.png';
import BarraPesquisa from '../../../componentes-reutilizaveis/BarraPesquisa/BarraPesquisa.jsx';
import './BarraPesquisaHome.css';

function BarraPesquisaHome() {

  const navigate = useNavigate();

  const [servicos, setServicos] = useState([]);
  const [erro, setErro] = useState(false);
  const [erroPesquisa, setErroPesquisa] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  const iconesServicos = {
    'Elétricas': '⚡',
    'Hidráulicos': '💧',
    'Pintura Residencial': '🖌️',
    'Montagem de móveis': '🛠️',
    'Alvenaria': '🧱'
  };



 function realizarBusca(valorInput) {

  const termo = valorInput
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (!termo) {
    return;
  }

  const servicoEncontrado = servicos.find((servico) => {

    const nomeServico = servico.nome
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return (
      nomeServico === termo ||
      nomeServico === `${termo}s` ||
      `${nomeServico}s` === termo
    );

  });

  if (!servicoEncontrado) {
    setErroPesquisa(true);
    return;
  }

  setErroPesquisa(false);

  navigate(
    `/resultados?servico=${encodeURIComponent(servicoEncontrado.nome)}`
  );
}

  useEffect(() => {

    buscarServicos()
      .then((dados) => {
        setServicos(dados);
      })
      .catch(() => {
        setErro(true);
      });

  }, []);

  return (
    <>
      <section
        className="barra-pesquisa-home"
        style={{ backgroundImage: `url(${fundoHome})` }}
      >

        <div className="texto-pesquisa">

          <h1>
            Encontre quem faz
            <br />
            <span>sua reforma</span>
          </h1>

          <p>
            Pesquise e encontre profissionais qualificados
            <br />
            para o seu projeto. Mais praticidade e confiança do início ao fim.
          </p>

        </div>

        <div className="area-pesquisa">

          <BarraPesquisa onBuscar={realizarBusca} />

          {erroPesquisa && (
            <p className="mensagem-erro">
              Serviço não encontrado. Escolha um serviço disponível.
            </p>
          )}

        </div>

        {erro ? (
          <p className="mensagem-erro">
            Não foi possível carregar os serviços.
          </p>

        ) : servicos.length === 0 ? (
          <p className="mensagem-erro">
            Nenhum serviço disponível.
          </p>

        ) : (

          <div className="lista-servicos">

            {servicos.map(servico => (

              <button
                key={servico.id}
                className="card-servico"
                onClick={() => {

                  setServicoSelecionado(servico);

                  buscarProfissionais(servico.nome)
                    .then(dados => {
                      console.log('Profissionais encontrados:', dados);
                    })
                    .catch(erro => {
                      console.error(
                        'Erro ao buscar profissionais:',
                        erro
                      );
                    });

                }}
              >

                <span className="icone-servico">
                  {iconesServicos[servico.nome]}
                </span>

                <span className="nome-servico">
                  {servico.nome}
                </span>

              </button>

            ))}

          </div>

        )}

      </section>
    </>
  );
}

export default BarraPesquisaHome;