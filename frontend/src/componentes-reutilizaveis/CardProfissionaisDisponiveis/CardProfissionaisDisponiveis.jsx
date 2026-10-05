import { useEffect, useState } from 'react';
import CardProfissional from '../CardProfissional/CardProfissional.jsx';
import iconeProfissionais from '../../assets/icone-profissionais.png';
import {
    buscarTodosProfissionais,
    buscarServicosDoProfissional
} from '../../servicos/api.js';
import './CardProfissionaisDisponiveis.css';

function ProfissionaisDisponiveis() {

    const [profissionais, setProfissionais] = useState([]);
    const [indice, setIndice] = useState(0);

    useEffect(() => {
        buscarTodosProfissionais()
            .then(async (profissionais) => {

                const profissionaisComServicos = await Promise.all(
                    profissionais.map(async (profissional) => {

                        const servicos = await buscarServicosDoProfissional(
                            profissional.id
                        );

                        return {
                            ...profissional,
                            servicos
                        };
                    })
                );

                setProfissionais(profissionaisComServicos);
            })
            .catch((erro) => {
                console.error(
                    'Erro ao buscar profissionais:',
                    erro
                );
            });
    }, []);

    /*
     * Movimento automático do carrossel.
     *
     * A cada 3 segundos avançamos um card.
     */
    useEffect(() => {

        if (profissionais.length <= 3) {
            return;
        }

        const intervalo = setInterval(() => {

            setIndice((indiceAtual) => {

                if (indiceAtual >= profissionais.length - 3) {
                    return 0;
                }

                return indiceAtual + 1;
            });

        }, 3000);

        return () => {
            clearInterval(intervalo);
        };

    }, [profissionais]);

    return (
        <section className="profissionais-home">

            <div className="titulo-profissionais">

                <img
                    src={iconeProfissionais}
                    alt="Ícone de profissionais"
                    className="icone-profissionais"
                />

                <h2>
                    Profissionais Disponíveis
                </h2>

            </div>

            <p>
                Encontre profissionais que oferecem o que você precisa.
            </p>

            <div className="carrossel-profissionais">

                <div
                    className="lista-profissionais"
                    style={{
                        transform: `translateX(-${indice * 304}px)`
                    }}
                >

                    {profissionais.map((profissional) => (

                        <CardProfissional
                            key={profissional.id}
                            nome={profissional.nome}
                            descricao={profissional.descricao}
                            foto_perfil_url={
                                profissional.foto_perfil_url
                            }
                            servicos={profissional.servicos}
                        />

                    ))}

                </div>

            </div>

        </section>
    );
}

export default ProfissionaisDisponiveis;