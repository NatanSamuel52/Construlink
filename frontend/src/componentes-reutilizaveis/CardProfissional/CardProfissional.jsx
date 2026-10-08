import './CardProfissional.css';

function CardProfissional({ nome, descricao, foto_perfil_url, servicos }) {
    return (
        <div className="card-profissional">

            {foto_perfil_url ? (
                <img
                    src={foto_perfil_url}
                    alt={`Foto de ${nome}`}
                />
            ) : (
                <div className="foto-placeholder">
                    Foto do profissional
                </div>
            )}

            <div className="card-profissional-conteudo">

                <h3>{nome}</h3>

                <p className="descricao">
                    {descricao}
                </p>
                <div className="servicos-profissional">
                    {servicos.map((servico) => (
                        <span key={servico.id} className="servico">
                            {servico.nome}
                        </span>
                    ))}
                </div>
                <button>
                    Ver perfil
                </button>

            </div>

        </div>
    );
}
export default CardProfissional;