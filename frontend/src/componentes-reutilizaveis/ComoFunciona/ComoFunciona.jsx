import {
  FaCog,
  FaSearch,
  FaUser,
  FaFileAlt,
  FaCommentDots,
  FaShieldAlt,
  FaUsers,
  FaImage,
  FaWrench,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ComoFunciona.css';
import { buscarQuantidadeProfissionais } from '../../servicos/api.js';

function ComoFunciona() {
  const navigate = useNavigate();
  const [quantidade, setQuantidade] = useState(null);
  const [carregandoQuantidade, setCarregandoQuantidade] = useState(true);

  useEffect(() => {
    buscarQuantidadeProfissionais()
      .then((dados) => {
        setQuantidade(dados.quantidade);
      })
      .catch((erro) => {
        console.error('Erro ao buscar quantidade de profissionais:', erro);
      })
      .finally(() => {
        setCarregandoQuantidade(false);
      });
  }, []);

  return (
    <section id='como-funciona' className='como-funciona'>
      <div className='titulo-como-funciona'>
        <span className='icone-titulo'>
          <FaCog />
        </span>

        <div>
          <h2>Como funciona?</h2>
          <p>É simples, rápido e seguro.</p>
        </div>
      </div>

      <div className='conteudo-como-funciona'>
        <div className='passos-como-funciona'>
          <div className='passo'>
            <div className='icone-passo'>
              <FaSearch />
            </div>

            <div>
              <h3>1. Pesquise o serviço</h3>
              <p>Encontre profissionais por categoria.</p>
            </div>
          </div>

          <div className='passo'>
            <div className='icone-passo'>
              <FaUser />
            </div>

            <div>
              <h3>2. Escolha um profissional</h3>
              <p>Veja o perfil e os serviços oferecidos.</p>
            </div>
          </div>

          <div className='passo'>
            <div className='icone-passo'>
              <FaFileAlt />
            </div>

            <div>
              <h3>3. Faça sua solicitação</h3>
              <p>Envie uma mensagem com o que você precisa.</p>
            </div>
          </div>

          <div className='passo'>
            <div className='icone-passo'>
              <FaCommentDots />
            </div>

            <div>
              <h3>4. Converse e combine</h3>
              <p>Troque informações e combine os detalhes do atendimento.</p>
            </div>
          </div>
        </div>

        <div className='seguranca'>
          <div className='icone-seguranca'>
            <FaShieldAlt />
          </div>

          <div>
            <h3>
              Mais segurança
              <br />
              para você
            </h3>
            <p>Profissionais reais, perfis sérios e de confiança.</p>
          </div>
        </div>
      </div>

      <div className='informacoes-home'>
        <div className='informacao'>
          <span className='icone-informacao'>
            <FaUsers />
          </span>

          <div>
            <strong>
              {carregandoQuantidade
                ? '...'
                : quantidade === null
                  ? '—'
                  : `+${quantidade}`}
            </strong>
            <p>Profissionais cadastrados</p>
          </div>
        </div>

        <div className='informacao'>
          <span className='icone-informacao'>
            <FaImage />
          </span>

          <div>
            <strong>Trabalhos realizados</strong>
            <p>Veja exemplos nos perfis profissionais.</p>
          </div>
        </div>

        <div className='informacao'>
          <span className='icone-informacao'>
            <FaWrench />
          </span>

          <div>
            <strong>Diversas áreas</strong>
            <p>para a sua necessidade</p>
          </div>
        </div>

        <div className='cadastro-home'>
          <button
            type='button'
            onClick={() => navigate('/cadastro')}
          >
            Cadastre-se agora →
          </button>
          <p>É gratuito e leva menos de 2 minutos.</p>
        </div>
      </div>
    </section>
  );
}

export default ComoFunciona;
