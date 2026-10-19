import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CardProfissionalResultado.css';

const iconesServicos = {
  Elétricas: '⚡',
  Hidráulicos: '💧',
  'Pintura Residencial': '🖌️',
  'Montagem de móveis': '🛠️',
  Alvenaria: '🧱',
};

function CardProfissionalResultado({
  id,
  nome,
  descricao,
  foto_perfil_url,
  servicos,
}) {
  const navigate = useNavigate();
  const [erroFoto, setErroFoto] = useState(false);

  const exibirFoto = foto_perfil_url && !erroFoto;

  function abrirPerfil() {
    navigate(`/perfil-profissional/${id}`);
  }

  return (
    <article className='card-profissional-resultado'>
      <div className='foto-profissional-resultado'>
        {exibirFoto ? (
          <img
            src={foto_perfil_url}
            alt={`Foto de ${nome}`}
            onError={() => setErroFoto(true)}
          />
        ) : (
          <div className='foto-placeholder-resultado'>Foto do profissional</div>
        )}
      </div>

      <div className='conteudo-profissional-resultado'>
        <h3>{nome}</h3>

        <p className='descricao-profissional-resultado'>{descricao}</p>

        <div className='servicos-profissional-resultado'>
          <span className='titulo-servicos'>Serviços:</span>

          {servicos.map((servico) => (
            <span key={servico.id} className='servico-resultado'>
              {iconesServicos[servico.nome] || '🛠️'} {servico.nome}
            </span>
          ))}
        </div>
      </div>

      <div className='acao-profissional-resultado'>
        <button onClick={abrirPerfil}>Ver perfil</button>
      </div>
    </article>
  );
}

export default CardProfissionalResultado;
