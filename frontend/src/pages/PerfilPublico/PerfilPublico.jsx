import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Cabecalho from '../../componentes-reutilizaveis/Cabecalho/Cabecalho.jsx';
import Rodape from '../../componentes-reutilizaveis/Rodape/Rodape.jsx';

import './PerfilPublico.css';

function PerfilPublico() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [profissional, setProfissional] = useState(null);
    const [servicos, setServicos] = useState([]);

    useEffect(() => {

        async function carregarPerfil() {

            try {

                const respostaPerfil = await fetch(
                    `http://localhost:3000/api/profissionais/${id}`
                );

                if (!respostaPerfil.ok) {
                    throw new Error(
                        'Erro ao consultar profissional'
                    );
                }

                const dadosPerfil =
                    await respostaPerfil.json();

                setProfissional(dadosPerfil);

                const respostaServicos = await fetch(
                    `http://localhost:3000/api/profissionais/${id}/servicos`
                );

                if (!respostaServicos.ok) {
                    throw new Error(
                        'Erro ao consultar serviços'
                    );
                }

                const dadosServicos =
                    await respostaServicos.json();

                setServicos(dadosServicos);

            } catch (erro) {

                console.error(
                    'Erro ao carregar perfil:',
                    erro
                );

            }
        }

        carregarPerfil();

    }, [id]);

    function voltarParaResultados() {
        navigate(-1);
    }

    if (!profissional) {
        return (
            <>
                <Cabecalho />

                <main className="perfil-publico">

                    <p>
                        Carregando perfil...
                    </p>

                </main>

                <Rodape />
            </>
        );
    }

    return (
        <>
            <Cabecalho />

            <main className="perfil-publico">

                <button
                    className="voltar-resultados"
                    onClick={voltarParaResultados}
                >
                    ← Voltar para os resultados
                </button>

                <section className="perfil-profissional">

                    <div className="dados-principais">

                        <div className="foto-perfil">

                            {profissional.foto_perfil_url ? (
                                <img
                                    src={profissional.foto_perfil_url}
                                    alt={`Foto de ${profissional.nome}`}
                                />
                            ) : (
                                <div className="foto-placeholder">
                                    Foto do profissional
                                </div>
                            )}

                        </div>

                        <div className="informacoes-profissional">

                            <h1>
                                {profissional.nome}
                            </h1>

                            <p>
                                {profissional.descricao}
                            </p>

                            <h2>
                                Serviços oferecidos
                            </h2>

                            <div className="servicos-perfil">

                                {servicos.map((servico) => (
                                    <span
                                        key={servico.id}
                                        className="servico-perfil"
                                    >
                                        {servico.nome}
                                    </span>
                                ))}

                            </div>

                        </div>

                        <div className="acao-contato">

                            <button>
                                💬 Entrar em contato
                            </button>

                        </div>

                    </div>

                </section>

                <section className="trabalhos-realizados">

                    <div className="titulo-trabalhos">

                        <h2>
                            Trabalhos realizados
                        </h2>

                        <p>
                            Confira alguns trabalhos já realizados
                            por este profissional.
                        </p>

                    </div>

                    <div className="lista-trabalhos">

                        <p>
                            Nenhum trabalho cadastrado.
                        </p>

                    </div>

                </section>

                <section className="sobre-profissional">

                    <h2>
                        Sobre o profissional
                    </h2>

                    <div className="sobre-conteudo">

                        <div className="informacoes-sobre">

                            <div className="item-sobre">

                                <span className="icone-sobre">
                                    👤
                                </span>

                                <div>

                                    <strong>
                                        Nome
                                    </strong>

                                    <p>
                                        {profissional.nome}
                                    </p>

                                </div>

                            </div>

                            <div className="item-sobre">

                                <span className="icone-sobre">
                                    📄
                                </span>

                                <div>

                                    <strong>
                                        Descrição
                                    </strong>

                                    <p>
                                        {profissional.descricao}
                                    </p>

                                </div>

                            </div>

                            <div className="item-sobre">

                                <span className="icone-sobre">
                                    🛠
                                </span>

                                <div>

                                    <strong>
                                        Serviços oferecidos
                                    </strong>

                                    <div className="servicos-perfil">

                                        {servicos.map((servico) => (
                                            <span
                                                key={servico.id}
                                                className="servico-perfil"
                                            >
                                                {servico.nome}
                                            </span>
                                        ))}

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="area-contato">

                            <div className="icone-contato">
                                💬
                            </div>

                            <h3>
                                Gostou do trabalho?
                            </h3>

                            <p>
                                Entre em contato com este profissional
                                e envie sua mensagem.
                            </p>

                            <button>
                                Entrar em contato
                            </button>

                        </div>

                    </div>

                </section>

                <button
                    className="voltar-resultados"
                    onClick={voltarParaResultados}
                >
                    ← Voltar para os resultados
                </button>

            </main>

            <Rodape />
        </>
    );
}

export default PerfilPublico;