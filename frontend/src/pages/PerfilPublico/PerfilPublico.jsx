import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../../config/api';
import Rodape from '../../componentes-reutilizaveis/Rodape/Rodape.jsx';

import './PerfilPublico.css';

const iconesServicos = {
  Elétricas: '⚡',
  Hidráulicos: '💧',
  'Pintura Residencial': '🖌️',
  'Montagem de móveis': '🛠️',
  Alvenaria: '🧱',
};

function PerfilPublico() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profissional, setProfissional] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [trabalhos, setTrabalhos] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controlador = new AbortController();

    async function carregarPerfil() {
      setCarregando(true);
      setErro('');
      setProfissional(null);
      setServicos([]);
      setTrabalhos([]);

      try {
        const respostaPerfil = await fetch(`${API_URL}/profissionais/${id}`, {
          signal: controlador.signal,
        });

        if (!respostaPerfil.ok) {
          throw new Error('Não foi possível consultar o profissional.');
        }

        const dadosPerfil = await respostaPerfil.json();

        const respostaServicos = await fetch(
          `${API_URL}/profissionais/${id}/servicos`,
          { signal: controlador.signal },
        );

        if (!respostaServicos.ok) {
          throw new Error('Não foi possível consultar os serviços.');
        }

        const dadosServicos = await respostaServicos.json();

        setProfissional(dadosPerfil);
        setServicos(dadosServicos);

        try {
          const respostaTrabalhos = await fetch(
            `${API_URL}/profissionais/${id}/trabalhos`,
            { signal: controlador.signal },
          );

          if (!respostaTrabalhos.ok) {
            throw new Error(
              'Não foi possível consultar os trabalhos realizados.',
            );
          }

          const dadosTrabalhos = await respostaTrabalhos.json();

          setTrabalhos(dadosTrabalhos);
        } catch (erroTrabalhos) {
          if (erroTrabalhos.name === 'AbortError') {
            throw erroTrabalhos;
          }

          console.error('Erro ao carregar trabalhos:', erroTrabalhos);

          setTrabalhos(null);
        }
      } catch (erroConsulta) {
        if (erroConsulta.name !== 'AbortError') {
          console.error('Erro ao carregar perfil:', erroConsulta);

          setErro(
            erroConsulta.message || 'Ocorreu um erro ao carregar o perfil.',
          );
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarPerfil();

    return () => {
      controlador.abort();
    };
  }, [id]);

  function voltarParaResultados() {
    navigate(-1);
  }

  if (carregando) {
    return (
      <>
        <main className='perfil-publico'>
          <p>Carregando perfil...</p>
        </main>

        <Rodape />
      </>
    );
  }

  if (erro || !profissional) {
    return (
      <>
        <main className='perfil-publico'>
          <button className='voltar-resultados' onClick={voltarParaResultados}>
            ← Voltar para os resultados
          </button>

          <p role='alert'>{erro || 'Profissional não encontrado.'}</p>
        </main>

        <Rodape />
      </>
    );
  }

  return (
    <>
      <main className='perfil-publico'>
        <button className='voltar-resultados' onClick={voltarParaResultados}>
          ← Voltar para os resultados
        </button>

        <section className='perfil-profissional'>
          <div className='dados-principais'>
            <div className='foto-perfil'>
              {profissional.foto_perfil_url ? (
                <img
                  src={profissional.foto_perfil_url}
                  alt={`Foto de ${profissional.nome}`}
                />
              ) : (
                <div className='foto-placeholder'>Foto do profissional</div>
              )}
            </div>

            <div className='informacoes-profissional'>
              <h1>{profissional.nome}</h1>

              <p>{profissional.descricao || 'Descrição não informada.'}</p>

              <h2>Serviços oferecidos</h2>

              <div className='servicos-perfil'>
                {servicos.length > 0 ? (
                  servicos.map((servico) => (
                    <span key={servico.id} className='servico-perfil'>
                      {iconesServicos[servico.nome] || '🛠️'} {servico.nome}
                    </span>
                  ))
                ) : (
                  <p>Este profissional não possui serviços cadastrados.</p>
                )}
              </div>
            </div>

            <div className='acao-contato'>
              <button type='button' disabled>
                💬 Entrar em contato
              </button>
            </div>
          </div>
        </section>

        <section className='trabalhos-realizados'>
          <div className='titulo-trabalhos'>
            <h2>Trabalhos realizados</h2>

            <p>Confira alguns trabalhos já realizados por este profissional.</p>
          </div>

          <div className='lista-trabalhos'>
            {trabalhos === null ? (
              <p className='mensagem-sem-trabalhos' role='alert'>
                Não foi possível carregar os trabalhos realizados.
              </p>
            ) : trabalhos.length > 0 ? (
              <div className='grade-trabalhos'>
                {trabalhos.map((trabalho) => (
                  <article className='card-trabalho' key={trabalho.id}>
                    {trabalho.foto_url && (
                      <img
                        src={trabalho.foto_url}
                        alt={`Trabalho realizado: ${trabalho.titulo}`}
                      />
                    )}

                    <div className='conteudo-trabalho'>
                      <h3>{trabalho.titulo}</h3>
                      <p>{trabalho.descricao}</p>

                      {trabalho.criado_em && (
                        <p className='data-trabalho'>
                          Data:{' '}
                          {new Date(trabalho.criado_em).toLocaleDateString(
                            'pt-BR',
                          )}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className='mensagem-sem-trabalhos'>
                Nenhum trabalho cadastrado.
              </p>
            )}
          </div>
        </section>

        <section className='sobre-profissional'>
          <h2>Sobre o profissional</h2>

          <div className='sobre-conteudo'>
            <div className='informacoes-sobre'>
              <div className='item-sobre item-sobre-nome'>
                {profissional.foto_perfil_url ? (
                  <img
                    className='foto-sobre-profissional'
                    src={profissional.foto_perfil_url}
                    alt={`Foto de ${profissional.nome}`}
                    onError={(evento) => {
                      evento.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className='icone-sobre'>👤</span>
                )}

                <div>
                  <strong>Nome</strong>
                  <p>{profissional.nome}</p>
                </div>
              </div>

              <div className='item-sobre'>
                <span className='icone-sobre'>📄</span>

                <div>
                  <strong>Descrição</strong>
                  <p>{profissional.descricao || 'Descrição não informada.'}</p>
                </div>
              </div>

              <div className='item-sobre'>
                <span className='icone-sobre'>🛠</span>

                <div>
                  <strong>Serviços oferecidos</strong>

                  <div className='servicos-perfil'>
                    {servicos.map((servico) => (
                      <span key={servico.id} className='servico-perfil'>
                        {servico.nome}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='area-contato'>
              <div className='icone-contato'>💬</div>

              <h3>Gostou do trabalho?</h3>

              <p>
                Entre em contato com este profissional e envie sua mensagem.
              </p>

              <button type='button' disabled>
                Entrar em contato
              </button>
            </div>
          </div>
        </section>

        <button className='voltar-resultados' onClick={voltarParaResultados}>
          ← Voltar para os resultados
        </button>
      </main>

      <Rodape />
    </>
  );
}

export default PerfilPublico;
