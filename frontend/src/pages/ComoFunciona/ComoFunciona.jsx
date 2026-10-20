import { FiSearch, FiUser, FiImage, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ComoFunciona.css';

const etapas = [
  {
    numero: '01',
    titulo: 'Busque um serviço',
    descricao:
      'Pesquise o serviço de construção ou reforma de que você precisa.',
    icone: FiSearch,
    classe: 'busca',
  },
  {
    numero: '02',
    titulo: 'Conheça os profissionais',
    descricao:
      'Consulte os perfis e conheça os serviços oferecidos por cada profissional.',
    icone: FiUser,
    classe: 'perfil',
  },
  {
    numero: '03',
    titulo: 'Veja os trabalhos realizados',
    descricao:
      'Explore os exemplos de trabalhos apresentados nos perfis e encontre opções adequadas à sua necessidade.',
    icone: FiImage,
    classe: 'trabalhos',
  },
];

function ComoFunciona() {
  const navigate = useNavigate();
  return (
    <main className='pagina-como-funciona'>
      <section className='como-funciona-hero'>
        <span className='como-funciona-etiqueta'>CONSTRULINK V1.0</span>

        <h1>
          Sua próxima reforma começa <span>aqui.</span>
        </h1>

        <p>
          Descubra como encontrar profissionais e conhecer seus serviços e
          trabalhos em poucos passos.
        </p>
      </section>

      <section
        className='fluxo-como-funciona'
        aria-label='Etapas para utilizar o Construlink'
      >
        <div className='fluxo-caminho' aria-hidden='true'>
          <div className='fluxo-caminho-progresso' />
        </div>

        {etapas.map((etapa, indice) => {
          const Icone = etapa.icone;

          return (
            <article
              key={etapa.numero}
              className={`fluxo-etapa fluxo-etapa--${etapa.classe}`}
            >
              <div className='fluxo-etapa-icone'>
                <Icone size={30} />
                <span>{etapa.numero}</span>
              </div>

              <div className='fluxo-etapa-conteudo'>
                <span className='fluxo-etapa-legenda'>
                  ETAPA {etapa.numero}
                </span>

                <h2>{etapa.titulo}</h2>

                <p>{etapa.descricao}</p>
              </div>

              {indice < etapas.length - 1 && (
                <FiArrowRight className='fluxo-etapa-seta' aria-hidden='true' />
              )}
            </article>
          );
        })}
      </section>

      <section className='como-funciona-final'>
        <div>
          <span className='como-funciona-final-detalhe'>SIMPLES ASSIM</span>

          <h2>Tudo começa com o que você precisa.</h2>

          <p>
            Explore os serviços, conheça os profissionais e consulte os
            trabalhos apresentados para encontrar uma opção adequada ao seu
            projeto.
          </p>
          <button
            type='button'
            className='como-funciona-final-botao'
            onClick={() => navigate('/')}
          >
            <FiSearch aria-hidden='true' />
            Encontrar profissionais
            <FiArrowRight aria-hidden='true' />
          </button>
        </div>

        <FiSearch className='como-funciona-final-icone' aria-hidden='true' />
      </section>
    </main>
  );
}

export default ComoFunciona;
