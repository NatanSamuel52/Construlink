import { useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiSearch,
  FiUser,
  FiImage,
  FiTool,
} from 'react-icons/fi';

import './SobreNos.css';

function SobreNos() {
  const navigate = useNavigate();

  return (
    <main className='pagina-sobre'>
      <section className='sobre-apresentacao'>
        <div className='sobre-apresentacao-conteudo'>
          <span className='sobre-selo'>
            CONSTRULINK <span>•</span> VERSÃO 1.0
          </span>

          <h1>
            Sua reforma começa com uma
            <span> boa conexão.</span>
          </h1>

          <p className='sobre-introducao'>
            Encontrar o profissional certo começa por conhecer as opções
            disponíveis. O Construlink aproxima quem precisa de serviços de
            reforma e manutenção de quem oferece esses serviços.
          </p>

          <button
            type='button'
            className='sobre-botao'
            onClick={() => navigate('/')}
          >
            Explorar serviços
            <FiArrowUpRight aria-hidden='true' />
          </button>
        </div>

        <div className='sobre-destaque-visual' aria-hidden='true'>
          <div className='sobre-visual-fundo' />

          <div className='sobre-visual-grade'>
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className='sobre-visual-icone'>
            <FiTool />
          </div>

          <div className='sobre-visual-texto'>
            <span>CONSTRUINDO CONEXÕES</span>
            <strong>
              Pessoas.
              <br />
              Serviços.
              <br />
              Possibilidades.
            </strong>
          </div>

          <div className='sobre-visual-detalhe'>
            <FiSearch />
            <span>Uma busca pode ser o começo.</span>
          </div>
        </div>
      </section>

      <section className='sobre-proposito'>
        <div className='sobre-secao-titulo'>
          <span className='sobre-legenda'>NOSSO PROPÓSITO</span>

          <h2>
            Tornar a busca por serviços
            <span> mais simples.</span>
          </h2>
        </div>

        <div className='sobre-proposito-texto'>
          <p>
            Quem precisa reformar ou realizar uma manutenção precisa encontrar
            opções e conhecer os serviços oferecidos antes de decidir por onde
            começar.
          </p>

          <p>
            Ao mesmo tempo, os profissionais precisam de um espaço para
            apresentar suas informações, seus serviços e exemplos dos trabalhos
            que realizam.
          </p>

          <p className='sobre-frase-destaque'>
            O Construlink nasce para aproximar essas duas necessidades em uma
            única plataforma.
          </p>
        </div>
      </section>

      <section className='sobre-publicos'>
        <div className='sobre-secao-cabecalho'>
          <span className='sobre-legenda'>DOIS LADOS, UMA CONEXÃO</span>

          <h2>
            Feito para quem procura
            <br />e para quem oferece.
          </h2>
        </div>

        <div className='sobre-publicos-grade'>
          <article className='sobre-publico sobre-publico--cliente'>
            <div className='sobre-publico-topo'>
              <span className='sobre-publico-icone'>
                <FiSearch aria-hidden='true' />
              </span>
              <span className='sobre-publico-numero'>01</span>
            </div>

            <h3>Para quem precisa de um serviço</h3>

            <p>
              Pesquise categorias, encontre profissionais, consulte seus perfis
              e conheça exemplos de trabalhos apresentados na plataforma.
            </p>

            <button
              type='button'
              className='sobre-link'
              onClick={() => navigate('/')}
            >
              Encontrar profissionais
              <FiArrowUpRight aria-hidden='true' />
            </button>
          </article>

          <article className='sobre-publico sobre-publico--profissional'>
            <div className='sobre-publico-topo'>
              <span className='sobre-publico-icone'>
                <FiUser aria-hidden='true' />
              </span>
              <span className='sobre-publico-numero'>02</span>
            </div>

            <h3>Para quem oferece um serviço</h3>

            <p>
              Apresente suas informações profissionais, cadastre os serviços que
              oferece e mostre trabalhos realizados para que clientes conheçam
              seu perfil.
            </p>

            <button
              type='button'
              className='sobre-link'
              onClick={() =>
                navigate('/cadastro', {
                  state: { papelInicial: 'profissional' },
                })
              }
            >
              Conhecer o cadastro
              <FiArrowUpRight aria-hidden='true' />
            </button>
          </article>
        </div>
      </section>

      <section className='sobre-recursos'>
        <div className='sobre-recursos-intro'>
          <span className='sobre-legenda'>A PLATAFORMA</span>

          <h2>O que você encontra no Construlink?</h2>

          <p>
            Recursos para conhecer serviços e profissionais antes de escolher o
            próximo passo.
          </p>
        </div>

        <div className='sobre-recursos-lista'>
          <article className='sobre-recurso'>
            <span className='sobre-recurso-icone'>
              <FiSearch aria-hidden='true' />
            </span>

            <div>
              <h3>Pesquisa de serviços</h3>
              <p>
                Encontre categorias de reforma e manutenção sem precisar criar
                uma conta para consultar.
              </p>
            </div>

            <span className='sobre-recurso-numero'>01</span>
          </article>

          <article className='sobre-recurso'>
            <span className='sobre-recurso-icone'>
              <FiUser aria-hidden='true' />
            </span>

            <div>
              <h3>Perfis profissionais</h3>
              <p>
                Conheça as informações e os serviços apresentados por cada
                profissional.
              </p>
            </div>

            <span className='sobre-recurso-numero'>02</span>
          </article>

          <article className='sobre-recurso'>
            <span className='sobre-recurso-icone'>
              <FiImage aria-hidden='true' />
            </span>

            <div>
              <h3>Trabalhos realizados</h3>
              <p>
                Consulte os exemplos de trabalhos que os profissionais
                disponibilizam em seus perfis.
              </p>
            </div>

            <span className='sobre-recurso-numero'>03</span>
          </article>
        </div>
      </section>

      <section className='sobre-final'>
        <div>
          <span className='sobre-legenda'>CONSTRULINK V1.0</span>

          <h2>
            O próximo passo começa
            <span> com uma busca.</span>
          </h2>

          <p>
            Explore os serviços e conheça os profissionais disponíveis para o
            que você precisa.
          </p>
        </div>

        <button
          type='button'
          className='sobre-botao sobre-botao--final'
          onClick={() => navigate('/')}
        >
          Ir para o início
          <FiArrowUpRight aria-hidden='true' />
        </button>
      </section>
    </main>
  );
}

export default SobreNos;
