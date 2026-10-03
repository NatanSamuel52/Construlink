const API_URL = 'http://localhost:3000/api';

export async function buscarServicos() {
    
        const resposta = await fetch(`${API_URL}/servicos`);

       if(!resposta.ok) {
            throw new Error('Erro ao buscar serviços');
        }
        const dados = await resposta.json();
        
        return dados;  
}

export async function buscarProfissionais(servico) {
    const nomeServico = encodeURIComponent(servico);

    const resposta = await fetch(
        `${API_URL}/profissionais?servico=${nomeServico}`
    );

    if (!resposta.ok) {
        throw new Error('Erro ao consultar profissionais');
    }

    const dados = await resposta.json();

    return dados;
}