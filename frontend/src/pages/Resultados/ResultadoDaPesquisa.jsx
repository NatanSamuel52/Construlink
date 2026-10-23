import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  buscarProfissionais,
  buscarServicosDoProfissional,
} from '../../servicos/api';
import Rodape from '../../componentes-reutilizaveis/Rodape/Rodape.jsx';
import BarraPesquisa from '../../componentes-reutilizaveis/BarraPesquisa/BarraPesquisa.jsx';
import fundoResultados from '../Home/BarraPesquisaTelaHome/fundoHome.png';
import CardProfissionalResultado from '../../componentes-reutilizaveis/CardProfissionalResultado/CardProfissionalResultado.jsx';
import './ResultadoDaPesquisa.css';

function ResultadoDaPesquisa() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const servico = searchParams.get('servico')?.trim() || '';
  const [resultado, setResultado] = useState({
    servico: '',
    profissionais: [],
    erro: '',
  });

  useEffect(() => {
    let ativo = true;

    if (!servico) {
      return () => {
        ativo = false;
      };
    }

    async function carregarResultados() {
      try {
        const dados = await buscarProfissionais(servico);
        const servicosPorProfissional = await Promise.all(
          dados.map((profissional) =>
            buscarServicosDoProfissional(profissional.id),
          ),
        );

        if (ativo) {
          setResultado({
            servico,
            profissionais: dados.map((profissional, indice) => ({
              ...profissional,
              servicos: servicosPorProfissional[indice],
            })),
            erro: '',
          });
        }
      } catch (erroConsulta) {
        console.error('Erro ao buscar profissionais:', erroConsulta);
        if (ativo) {
          setResultado({
            servico,
            profissionais: [],
            erro: 'Não foi possível carregar os resultados. Tente novamente.',
          });
        }
      }
    }

    carregarResultados();

    return () => {
      ativo = false;
    };
  }, [servico]);

  function realizarBusca(valorInput) {
    const termo = valorInput.trim();

    if (termo) {
      navigate(`/resultados?servico=${encodeURIComponent(termo)}`);
    }
  }

  return (
    <>
      <main className='pagina-resultados'>
        <section
          className='cabecalho-resultados'
          style={{ backgroundImage: `url(${fundoResultados})` }}
        >
          <h1>
            Resultados da <span>sua busca</span>
          </h1>

          <p>
            Confira os profissionais que oferecem o serviço que você procura.
          </p>

          <BarraPesquisa onBuscar={realizarBusca} />

          {servico && (
            <p className='servico-pesquisado'>
              Mostrando profissionais que oferecem: <strong>{servico}</strong>
            </p>
          )}
        </section>

        <section className='lista-resultados' aria-live='polite'>
          {!servico ? (
            <p className='estado-resultados'>
              Pesquise um serviço para encontrar profissionais.
            </p>
          ) : resultado.servico !== servico ? (
            <p className='estado-resultados' role='status'>
              Buscando profissionais...
            </p>
          ) : resultado.erro ? (
            <p className='estado-resultados' role='alert'>
              {resultado.erro}
            </p>
          ) : resultado.profissionais.length === 0 ? (
            <p className='estado-resultados'>
              Nenhum profissional encontrado para este serviço.
            </p>
          ) : (
            resultado.profissionais.map((profissional) => (
              <CardProfissionalResultado
                key={profissional.id}
                id={profissional.id}
                nome={profissional.nome}
                descricao={profissional.descricao}
                foto_perfil_url={profissional.foto_perfil_url}
                servicos={profissional.servicos}
              />
            ))
          )}
        </section>
      </main>

      <Rodape />
    </>
  );
}

export default ResultadoDaPesquisa;