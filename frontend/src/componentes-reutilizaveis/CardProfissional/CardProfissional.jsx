import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CardProfissional.css';

const iconesServicos = {
  Elétricas: '⚡',
  Hidráulicos: '💧',
  'Pintura Residencial': '🖌️',
  'Montagem de móveis': '🛠️',
  Alvenaria: '🧱',
};

function CardProfissional({ id, nome, descricao, foto_perfil_url, servicos }) {
  const navigate = useNavigate();
  const [erroFoto, setErroFoto] = useState(false);

  const exibirFoto = foto_perfil_url && !erroFoto;

  return (
    <div className='card-profissional'>
      {exibirFoto ? (
        <img
          src={foto_perfil_url}
          alt={`Foto de ${nome}`}
          onError={() => setErroFoto(true)}
        />
      ) : (
        <div className='foto-placeholder'>Foto do profissional</div>
      )}

      <div className='card-profissional-conteudo'>
        <h3>{nome}</h3>

        <p className='descricao'>{descricao}</p>

        <div className='servicos-profissional'>
          {servicos.map((servico) => (
            <span key={servico.id} className='servico'>
              {iconesServicos[servico.nome] || '🛠️'} {servico.nome}
            </span>
          ))}
        </div>

        <button
          type='button'
          onClick={() => navigate(`/perfil-profissional/${id}`)}
        >
          Ver perfil
        </button>
      </div>
    </div>
  );
}

export default CardProfissional;
