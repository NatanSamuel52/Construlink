import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import {
    buscarProfissionais,
    buscarServicosDoProfissional
} from '../../servicos/api';

import Cabecalho from '../../componentes-reutilizaveis/Cabecalho/Cabecalho.jsx';
import Rodape from '../../componentes-reutilizaveis/Rodape/Rodape.jsx';
import BarraPesquisa from '../../componentes-reutilizaveis/BarraPesquisa/BarraPesquisa.jsx';

import fundoResultados from '../Home/BarraPesquisaTelaHome/fundoHome.png';

import CardProfissionalResultado
    from '../../componentes-reutilizaveis/CardProfissionalResultado/CardProfissionalResultado.jsx';

import './ResultadoDaPesquisa.css';

function ResultadoDaPesquisa() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const servico = searchParams.get('servico');

    const [profissionais, setProfissionais] = useState([]);

    useEffect(() => {

        if (!servico) {
            return;
        }

        buscarProfissionais(servico)
            .then((dados) => {

                console.log(
                    'PROFISSIONAIS DA API:',
                    dados
                );

                return Promise.all(
                    dados.map((profissional) => {

                        return buscarServicosDoProfissional(
                            profissional.id
                        );

                    })
                )
                .then((servicosDosProfissionais) => {

                    const profissionaisComServicos =
                        dados.map(
                            (profissional, indice) => ({
                                ...profissional,
                                servicos:
                                    servicosDosProfissionais[indice]
                            })
                        );

                    setProfissionais(
                        profissionaisComServicos
                    );

                });

            })
            .catch((erro) => {

                console.error(
                    'Erro ao buscar profissionais:',
                    erro
                );

            });

    }, [servico]);

    function realizarBusca(valorInput) {

        const termo = valorInput.trim();

        if (!termo) {
            return;
        }

        navigate(
            `/resultados?servico=${encodeURIComponent(termo)}`
        );
    }

    return (
        <>
            <Cabecalho />

            <main className="pagina-resultados">

                <section
                    className="cabecalho-resultados"
                    style={{
                        backgroundImage:
                            `url(${fundoResultados})`
                    }}
                >

                    <h1>
                        Resultados da{' '}
                        <span>sua busca</span>
                    </h1>

                    <p>
                        Confira os profissionais que oferecem
                        o serviço que você procura.
                    </p>

                    <BarraPesquisa
                        onBuscar={realizarBusca}
                    />

                    <p className="servico-pesquisado">

                        Mostrando profissionais que oferecem:{' '}

                        <strong>
                            {servico}
                        </strong>

                    </p>

                </section>

                <section className="lista-resultados">

                    {profissionais.map((profissional) => (

                        <CardProfissionalResultado
                            key={profissional.id}

                            id={profissional.id}

                            nome={profissional.nome}

                            descricao={
                                profissional.descricao
                            }

                            foto_perfil_url={
                                profissional.foto_perfil_url
                            }

                            servicos={
                                profissional.servicos
                            }
                        />

                    ))}

                </section>

            </main>

            <Rodape />
        </>
    );
}

export default ResultadoDaPesquisa;