import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarServicos } from '../../../servicos/api';
import fundoHome from './fundoHome.png';
import BarraPesquisa from '../../../componentes-reutilizaveis/BarraPesquisa/BarraPesquisa.jsx';
import './BarraPesquisaHome.css';

function BarraPesquisaHome() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [mensagemPesquisa, setMensagemPesquisa] = useState('');

  const iconesServicos = {
    Elétricas: '⚡',
    Hidráulicos: '💧',
    'Pintura Residencial': '🖌️',
    'Montagem de móveis': '🛠️',
    Alvenaria: '🧱',
  };

  function normalizarTexto(texto) {
    return texto
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/\s+/)
      .map((palavra) => palavra.replace(/s$/, ''))
      .join(' ');
  }

  function realizarBusca(valorInput) {
    const termo = normalizarTexto(valorInput);

    if (!termo) {
      setMensagemPesquisa('Digite o serviço que você está procurando.');
      return;
    }

    const servicoEncontrado = servicos.find((servico) => {
      const nomeServico = normalizarTexto(servico.nome);

      return nomeServico.includes(termo);
    });

    if (!servicoEncontrado) {
      setMensagemPesquisa(
        'Serviço não encontrado. Escolha um serviço disponível.',
      );
      return;
    }

    setMensagemPesquisa('');
    navigate(
      `/resultados?servico=${encodeURIComponent(servicoEncontrado.nome)}`,
    );
  }

  function selecionarServico(servico) {
    navigate(`/resultados?servico=${encodeURIComponent(servico.nome)}`);
  }

  useEffect(() => {
    let ativo = true;

    buscarServicos()
      .then((dados) => {
        if (ativo) {
          setServicos(dados);
          setErro(false);
        }
      })
      .catch((erroConsulta) => {
        console.error('Erro ao carregar serviços:', erroConsulta);
        if (ativo) {
          setErro(true);
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <section
      className='barra-pesquisa-home'
      style={{ backgroundImage: `url(${fundoHome})` }}
    >
      <div className='texto-pesquisa'>
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

      <div className='area-pesquisa'>
        <BarraPesquisa onBuscar={realizarBusca} />

        {mensagemPesquisa && (
          <p className='mensagem-erro' role='alert'>
            {mensagemPesquisa}
          </p>
        )}
      </div>

      {carregando ? (
        <p className='mensagem-servicos' role='status'>
          Carregando serviços...
        </p>
      ) : erro ? (
        <p className='mensagem-erro' role='alert'>
          Não foi possível carregar os serviços. Tente novamente mais tarde.
        </p>
      ) : servicos.length === 0 ? (
        <p className='mensagem-servicos' role='status'>
          Nenhum serviço disponível no momento.
        </p>
      ) : (
        <div className='lista-servicos'>
          {servicos.map((servico) => (
            <button
              key={servico.id}
              type='button'
              className='card-servico'
              onClick={() => selecionarServico(servico)}
            >
              <span className='icone-servico' aria-hidden='true'>
                {iconesServicos[servico.nome] || '🛠️'}
              </span>

              <span className='nome-servico'>{servico.nome}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default BarraPesquisaHome;