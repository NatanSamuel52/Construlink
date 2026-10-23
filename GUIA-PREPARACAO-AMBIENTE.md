# Preparação da entrega e apresentação — Construlink V1.0

Este guia cobre a configuração local, inicialização dos serviços e demonstração dos fluxos funcionais da V1.0.

## Requisitos

- Git;
- Docker Desktop com Docker Compose;
- Navegador atualizado.

A execução completa usa Docker para iniciar o PostgreSQL, a API e o frontend. Node.js e npm são necessários apenas para executar lint, build ou testes fora dos containers.

## Instalação

Clone o repositório e entre na pasta:

```powershell
git clone https://github.com/NatanSamuel52/Contrulink.git
Set-Location Contrulink
```

Crie o arquivo de configuração local sem versionar credenciais:

```powershell
Copy-Item .env.example .env
```

Edite `.env` e substitua `POSTGRES_PASSWORD` e `JWT_SECRET` por valores próprios. Mantenha também estas URLs locais:

```dotenv
VITE_API_URL=http://localhost:3000/api
PUBLIC_API_URL=http://localhost:3000
```

Se `.env` já existir, preserve os valores locais e apenas confira se as duas URLs estão definidas. Não compartilhe nem envie esse arquivo ao Git.

## Iniciar e conferir a aplicação

Na raiz do repositório, execute:

```powershell
docker compose up --build -d
docker compose ps
```

Espere os serviços `db`, `backend` e `frontend` aparecerem como `healthy` ou `running`. O banco e a API possuem verificações de saúde; o frontend aguarda a API ficar disponível.

Endereços locais:

- Aplicação: `http://localhost:5173`
- API: `http://localhost:3000/api/`
- PostgreSQL: `localhost:5432`

Confirme as respostas da API e do frontend:

```powershell
Invoke-WebRequest http://localhost:3000/api/ -UseBasicParsing
Invoke-WebRequest http://localhost:3000/api/servicos -UseBasicParsing
Invoke-WebRequest http://localhost:3000/api/profissionais -UseBasicParsing
Invoke-WebRequest http://localhost:5173 -UseBasicParsing
```

As três rotas da API devem responder com HTTP 200, e a página web deve abrir no navegador.

### Banco em uma instalação nova ou já existente

Em um volume PostgreSQL novo, o Compose cria as tabelas e carrega os dados de `database/schema.sql` e `database/seed.sql`. A base de demonstração fica com os mesmos 12 perfis públicos, 12 trabalhos realizados, 18 ofertas, cinco serviços e fotos que acompanham o repositório. Os dados servem para mostrar pesquisa, perfis e portfólios.

As contas dos perfis de demonstração não têm senha válida. O seed não inclui contas pessoais, clientes, conversas ou mensagens locais. Para demonstrar o fluxo de conversa, crie contas de teste próprias na aplicação e inicie uma conversa entre elas.

Os scripts de inicialização do PostgreSQL não são repetidos em um volume existente. Por isso, um volume novo recebe os dados de demonstração versionados, mas atualizar `database/seed.sql` não substitui nem sincroniza registros em um banco já utilizado. Preserve o volume existente se quiser manter os dados locais; para comparar a apresentação em uma instalação limpa, use uma cópia/clonagem nova do projeto e um volume PostgreSQL novo. Não use `docker compose down -v` na instalação atual, pois isso apaga o banco local.

Para aplicar a migração de leitura de mensagens em um volume existente:

```powershell
docker compose exec db psql -U construlink_user -d construlink -f /docker-entrypoint-initdb.d/03-ajusta-mensagens-nao-lidas.sql
```

Se os valores de usuário ou banco no seu `.env` forem diferentes, ajuste `-U` e `-d` para os valores configurados. Não use `docker compose down -v` para atualizar o banco: a opção `-v` apaga o volume e os dados locais.

O esquema em `database/schema.sql` contém as entidades de usuário, cliente, profissional, serviço, oferta de serviço, trabalho realizado, conversa e mensagem. A tabela auxiliar `conversa_leitura` dá suporte ao indicador de mensagens não lidas. Compare o esquema com a cópia oficial do MER V1.0 antes da aprovação final, caso ela tenha alterações que não estejam refletidas nesses arquivos.

## Roteiro de demonstração

Faça a demonstração com duas contas que possam ser cadastradas pela própria aplicação: uma de cliente e outra de profissional. Use endereços de e-mail de teste e não reutilize credenciais pessoais.

1. **Apresentar a página inicial:** mostrar categorias e a pesquisa de serviços.
2. **Pesquisar um serviço:** testar termos como `pintura` e `montagem`; abrir um resultado e consultar o perfil, os serviços oferecidos e os trabalhos realizados.
3. **Cadastrar o cliente:** sair da sessão, criar uma conta de cliente e entrar nela.
4. **Iniciar uma conversa:** no perfil de um profissional, escolher um serviço e iniciar a conversa.
5. **Responder como profissional:** sair da conta do cliente, entrar ou cadastrar a conta profissional e abrir a conversa recebida.
6. **Trocar mensagens:** enviar respostas nas duas contas, confirmar a ordem cronológica e verificar o indicador de mensagem não lida antes de abrir a conversa.
7. **Mostrar o perfil profissional:** editar os dados do perfil e, se houver tempo, adicionar uma foto ou um trabalho realizado.
8. **Encerrar:** voltar à pesquisa e apresentar a página “Sobre Nós”.

O arquivo `database/seed.sql` inclui os perfis e portfólios fictícios usados na apresentação. As senhas de demonstração não são credenciais de login. Cadastre as duas contas de teste usadas no fluxo de conversa durante a preparação ou a demonstração.

## Checklist final

- [ ] Docker Desktop iniciado e sem erros.
- [ ] `.env` local configurado; não incluir credenciais em capturas ou no Git.
- [ ] `db`, `backend` e `frontend` ativos em `docker compose ps`.
- [ ] API, serviços, profissionais e página inicial respondendo.
- [ ] Catálogo de serviços visível e pesquisa por `pintura` e `montagem` funcionando.
- [ ] Cadastro e login de cliente verificados.
- [ ] Cadastro/login de profissional e edição de perfil verificados.
- [ ] Conversa iniciada pelo cliente e resposta enviada pelo profissional.
- [ ] Indicador de mensagem não lida e histórico cronológico verificados.
- [ ] MER oficial comparado com `database/schema.sql`.
- [ ] Roteiro e navegador preparados antes da apresentação.

## Verificações de desenvolvimento

Para executar validações locais, use terminais separados:

```powershell
Set-Location backend
npm ci
npm test
```

```powershell
Set-Location frontend
npm ci
npm run lint
npm run build
```

Os testes automatizados do backend utilizam o banco configurado para a aplicação. Faça-os antes da apresentação e confira o resultado; eles podem criar registros de teste no banco local.

## Encerrar os serviços

Para parar os containers sem apagar o banco:

```powershell
docker compose down
```

Para voltar a apresentar, execute `docker compose up -d` na raiz do projeto.
