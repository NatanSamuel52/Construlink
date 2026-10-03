import { useEffect, useState } from 'react';
import CardProfissional from '../CardProfissional/CardProfissional.jsx';
import iconeProfissionais from '../../assets/icone-profissionais.png';
import { buscarTodosProfissionais,buscarServicosDoProfissional } from '../../servicos/api.js';
import './CardProfissionaisDisponiveis.css';

function ProfissionaisDisponiveis() {

    const [profissionais, setProfissionais] = useState([]);

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
            console.error('Erro ao buscar profissionais:', erro);
        });
}, []);

    return (
        <section className="profissionais-home">

            <div className="titulo-profissionais">
                <img src={iconeProfissionais} alt="Ícone de profissionais" className="icone-profissionais" />
                <h2>Profissionais Disponíveis</h2>
            </div>

            <p>Encontre profissionais que oferecem o que você precisa.</p>

            <div className="lista-profissionais">
                {profissionais.map((profissional) => (
                    <CardProfissional
                        key={profissional.id}
                        nome={profissional.nome}
                        descricao={profissional.descricao}
                        foto_perfil_url={profissional.foto_perfil_url}
                        servicos={profissional.servicos}
                    />
                ))}
            </div>


            { /* Somente demonstração de como vai ficar os cards 
            <div className="lista-profissionais">
            
                <CardProfissional
                    nome="Carlos Oliveira"
                    servico="Pintura Residencial"
                    descricao="Profissional especializado em pintura."
                    foto=""
                />

                <CardProfissional
                    nome="Mariana Costa"
                    servico="Elétricas"
                    descricao="Profissional especializada em serviços elétricos."
                    foto=""
                />

                <CardProfissional
                    nome="Rafael Santos"
                    servico="Hidráulicos"
                    descricao="Profissional especializado em serviços hidráulicos."
                    foto=""
                />

                 <CardProfissional
                    nome="Rafael Santos"
                    servico="Hidráulicos"
                    descricao="Profissional especializado em serviços hidráulicos."
                    foto=""
                />
            </div>
        */}
        </section>
    );
}

export default ProfissionaisDisponiveis;