# Construlink

Sistema web para conectar clientes a profissionais de serviços para construção, reforma, manutenção e atividades relacionadas.

> **Status:** Em desenvolvimento  
> **Versão da documentação:** 1.0

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Objetivo](#objetivo)
- [Escopo](#escopo)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Banco de dados](#banco-de-dados)
- [Docker e PostgreSQL](#docker-e-postgresql)
- [Backend](#backend)
- [Frontend](#frontend)
- [API](#api)
- [Testes realizados](#testes-realizados)
- [Execução do projeto](#execução-do-projeto)
- [Estado atual](#estado-atual)
- [Equipe](#equipe)

---

## Sobre o projeto

O **Construlink** é uma aplicação web voltada para facilitar a busca e a conexão entre clientes e profissionais que oferecem serviços relacionados à construção, reforma, manutenção e atividades residenciais.

A proposta do sistema não se limita a serviços de alvenaria ou construção. O projeto contempla diferentes tipos de profissionais e serviços, como:

- Instalações elétricas;
- Reparos hidráulicos;
- Pintura residencial;
- Montagem de móveis;
- Serviços relacionados à construção,alvenaria;
- Outros serviços que possam ser oferecidos por profissionais cadastrados na plataforma.

O projeto está sendo desenvolvido a partir de um protótipo inicial e está evoluindo para uma aplicação estruturada com **frontend, backend e banco de dados PostgreSQL**.

---

## Objetivo

O objetivo do Construlink é disponibilizar uma plataforma que permita ao usuário encontrar profissionais e consultar informações relacionadas aos serviços oferecidos.

A aplicação está sendo desenvolvida de forma incremental, seguindo o fluxo definido no projeto Scrum, com implementação das funcionalidades, integração com banco de dados, desenvolvimento da API e evolução da interface.

---

## Escopo

Entre as funcionalidades previstas e em desenvolvimento estão:

- Cadastro e autenticação de usuários;
- Busca e descoberta de profissionais;
- Consulta de serviços;
- Consulta de profissionais;
- Visualização de informações dos profissionais;
- Visualização de serviços oferecidos;
- Visualização de trabalhos realizados;
- Solicitação e acompanhamento de serviços;
- Painel do cliente;
- Painel do profissional;
- Avaliações;
- Administração do sistema;
- Infraestrutura e entrega da aplicação.

As funcionalidades são implementadas de acordo com a evolução das Sprints e das tarefas definidas no Jira.

---

## Tecnologias

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express
- JavaScript
- PostgreSQL Driver (`pg`)
- Dotenv

### Banco de dados

- PostgreSQL 16

### Infraestrutura

- Docker
- Docker Compose

### Controle de versão

- Git
- GitHub

### Gerenciamento do projeto

- Jira
- Scrum

---

## Arquitetura

A aplicação está sendo desenvolvida utilizando uma arquitetura separada em camadas principais:

```text
Frontend
   |
   v
Backend / API
   |
   v
PostgreSQL
```

### Frontend

Responsável pela interface que será utilizada pelos usuários da plataforma.

### Backend

Responsável pela API da aplicação, processamento das requisições e comunicação com o banco de dados.

### Banco de dados

Responsável pelo armazenamento das informações utilizadas pela aplicação.

### Docker

Responsável pela execução do PostgreSQL em um ambiente de desenvolvimento padronizado.

---

## Estrutura do projeto

A estrutura principal atual do projeto é:

```text
Contrulink/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── routes/
│   │   │   └── index.routes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── compose.yaml
├── ACORDOS.md
├── .gitignore
└── README.md
```

---

## Banco de dados

O banco de dados utilizado pelo projeto é o **PostgreSQL 16**.

A estrutura do banco está definida no arquivo:

```text
database/schema.sql
```

Os dados fictícios utilizados durante o desenvolvimento estão definidos em:

```text
database/seed.sql
```

### Tabelas atuais

O banco possui atualmente as seguintes tabelas:

- `usuario`
- `cliente`
- `profissional`
- `trabalho_realizado`
- `servico`
- `oferta_servico`
- `conversa`
- `mensagem`

Essas tabelas representam a estrutura atual utilizada pelo backend e pelas funcionalidades que estão sendo implementadas.

### Dados fictícios

O arquivo `seed.sql` contém dados fictícios para utilização durante o desenvolvimento e os testes da aplicação.

Entre os dados existentes estão profissionais, serviços oferecidos e trabalhos realizados.

Os dados atuais incluem profissionais como:

- Carlos Oliveira;
- Mariana Costa;
- Rafael Santos.

Também existem serviços fictícios relacionados a:

- Pintura residencial;
- Instalação elétrica;
- Reparos hidráulicos;
- Montagem de móveis.

---

## Docker e PostgreSQL

O PostgreSQL é executado através do Docker Compose.

O arquivo responsável pela configuração é:

```text
compose.yaml
```

O serviço configurado atualmente é:

```text
db
```

O container utilizado pelo projeto é:

```text
construlink-postgres
```

A imagem utilizada é:

```text
postgres:16
```

A porta utilizada para acesso ao PostgreSQL é:

```text
5432
```

O projeto utiliza um volume Docker para persistência dos dados do PostgreSQL.

### Verificar os serviços Docker

Na raiz do projeto, execute:

```bash
docker compose config --services
```

O resultado esperado é:

```text
db
```

### Verificar o container

Execute:

```bash
docker compose ps
```

O PostgreSQL deve aparecer como ativo e saudável.

---

## Configuração do banco

As informações de conexão do banco são obtidas através das variáveis de ambiente utilizadas pelo projeto.

O arquivo `.env` é utilizado localmente e não deve ser versionado no Git.

O backend utiliza essas variáveis para estabelecer a conexão com o PostgreSQL.

O arquivo responsável pela conexão é:

```text
backend/src/config/database.js
```

A aplicação utiliza o pacote `pg` para realizar a comunicação entre o Node.js e o PostgreSQL.

---

## Backend

O backend foi desenvolvido utilizando **Node.js + Express**.

O código principal está localizado em:

```text
backend/src/
```

### Arquivos principais

#### `server.js`

Responsável por iniciar o servidor HTTP.

#### `app.js`

Responsável pela configuração da aplicação Express e pelo registro das rotas.

#### `routes/index.routes.js`

Contém as rotas da API atualmente implementadas.

#### `config/database.js`

Responsável pela configuração da conexão com o PostgreSQL.

---

## Executando o backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Para iniciar o servidor:

```bash
npm start
```

O servidor é executado na porta:

```text
3000
```

A API pode ser acessada através de:

```text
http://localhost:3000
```

---

## API

As rotas da aplicação são disponibilizadas através do prefixo:

```text
/api
```

### Verificação da API

```http
GET /api/
```

Resposta esperada:

```json
{
  "mensagem": "API do Construlink funcionando!"
}
```

---

### Listar serviços

```http
GET /api/servicos
```

Retorna os serviços cadastrados no banco de dados.

---

### Listar profissionais

```http
GET /api/profissionais
```

Retorna os profissionais disponíveis.

---

### Filtrar profissionais por serviço

```http
GET /api/profissionais?servico=eletrica
```

Permite consultar profissionais relacionados a determinado serviço.

---

### Consultar profissional

```http
GET /api/profissionais/:id
```

Exemplo:

```http
GET /api/profissionais/2
```

Retorna as informações do profissional correspondente ao identificador informado.

---

### Consultar trabalhos realizados

```http
GET /api/profissionais/:id/trabalhos
```

Exemplo:

```http
GET /api/profissionais/2/trabalhos
```

Retorna os trabalhos realizados associados ao profissional.

---

### Consultar serviços do profissional

```http
GET /api/profissionais/:id/servicos
```

Exemplo:

```http
GET /api/profissionais/2/servicos
```

Retorna os serviços oferecidos pelo profissional.

---

## Tratamento de erros

A API possui validações para consultas de profissionais.

Quando o identificador informado não corresponde a um profissional existente, a API retorna:

```json
{
  "mensagem": "Profissional não encontrado."
}
```

Exemplo:

```http
GET /api/profissionais/999
```

Também existe validação para identificadores que não possuem formato numérico.

---

## Testes realizados

A API foi testada utilizando requisições HTTP diretamente no ambiente local.

### Teste da API

```bash
curl http://127.0.0.1:3000/api/
```

Resultado esperado:

```json
{
  "mensagem": "API do Construlink funcionando!"
}
```

### Teste dos serviços

```bash
curl http://127.0.0.1:3000/api/servicos
```

O endpoint retornou os serviços cadastrados no banco.

### Teste dos profissionais

```bash
curl http://127.0.0.1:3000/api/profissionais
```

O endpoint retornou os profissionais cadastrados no banco.

### Teste de filtro por serviço

```bash
curl "http://127.0.0.1:3000/api/profissionais?servico=eletrica"
```

O endpoint retornou o profissional relacionado ao serviço de instalação elétrica.

### Teste do perfil do profissional

```bash
curl http://127.0.0.1:3000/api/profissionais/2
```

O endpoint retornou os dados do profissional correspondente ao ID informado.

### Teste dos trabalhos realizados

```bash
curl http://127.0.0.1:3000/api/profissionais/2/trabalhos
```

O endpoint retornou os trabalhos associados ao profissional.

### Teste dos serviços do profissional

```bash
curl http://127.0.0.1:3000/api/profissionais/2/servicos
```

O endpoint retornou os serviços oferecidos pelo profissional.

### Teste de profissional inexistente

```bash
curl http://127.0.0.1:3000/api/profissionais/999
```

Resultado esperado:

```json
{
  "mensagem": "Profissional não encontrado."
}
```

---

## Frontend

O frontend está sendo desenvolvido utilizando **React + Vite**.

Os arquivos estão localizados em:

```text
frontend/
```

### Instalação das dependências

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

### Executar o frontend

Utilize:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local utilizado para acessar a aplicação.

O frontend e o backend são executados separadamente durante o desenvolvimento.

---

## Fluxo de desenvolvimento

O desenvolvimento do projeto segue o fluxo:

```text
Jira
  |
  v
Tarefa
  |
  v
Branch
  |
  v
Implementação
  |
  v
Testes
  |
  v
Commit
  |
  v
Push
  |
  v
Pull Request
  |
  v
Review
  |
  v
Merge
```

As alterações devem ser desenvolvidas em branches específicas relacionadas às tarefas do Jira.

---

## Convenção de commits

Os commits do projeto seguem o padrão:

```text
tipo(SCRUM-XXX): descrição curta
```

Exemplo:

```text
feat(SCRUM-265): integra conexão com PostgreSQL
```

Exemplos de tipos utilizados:

```text
feat
fix
chore
docs
refactor
test
```

---

## Branches

As branches são utilizadas para separar o desenvolvimento das funcionalidades e tarefas.

Exemplos:

```text
feature/scrum-361-...
feature/scrum-362-...
feature/scrum-364-...
feature/scrum-365-...
```

Cada branch deve estar relacionada à tarefa correspondente no Jira.

---

## Pull Requests

Após finalizar uma tarefa:

1. Fazer commit das alterações;
2. Enviar a branch para o GitHub;
3. Criar um Pull Request;
4. Solicitar revisão;
5. Aguardar a validação;
6. Realizar ajustes caso necessário;
7. Após aprovação, realizar o merge conforme o fluxo definido para o projeto.

As branches não devem ser mescladas sem seguir o processo de revisão estabelecido pela equipe.

---

## Execução do projeto

Para trabalhar no projeto localmente, o fluxo geral é:

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

### 2. Entrar no projeto

```bash
cd Contrulink
```

### 3. Iniciar o PostgreSQL

Na raiz do projeto:

```bash
docker compose up -d
```

### 4. Verificar o banco

```bash
docker compose ps
```

O container `construlink-postgres` deve estar ativo e saudável.

### 5. Iniciar o backend

Em um terminal:

```bash
cd backend
npm install
npm start
```

### 6. Iniciar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O backend e o frontend devem permanecer em terminais separados durante o desenvolvimento.

---

## Estado atual

A aplicação encontra-se em desenvolvimento incremental.

Atualmente já estão estruturados:

- Projeto React com Vite;
- Backend Node.js;
- Express;
- Conexão do backend com PostgreSQL;
- PostgreSQL executando através do Docker;
- Estrutura do banco de dados;
- Dados fictícios para desenvolvimento;
- Rotas da API;
- Consulta de profissionais;
- Consulta de serviços;
- Consulta de trabalhos realizados;
- Consulta dos serviços oferecidos por profissionais;
- Consulta individual de profissionais;
- Tratamento de profissional inexistente.

A integração completa das funcionalidades do frontend com a API continuará sendo desenvolvida conforme a evolução das Sprints.

---

## Banco de dados e ambiente de desenvolvimento

O ambiente atual utiliza um banco PostgreSQL denominado `construlink`.

A estrutura oficial do banco está documentada em:

```text
database/schema.sql
```

Os dados fictícios utilizados durante o desenvolvimento estão documentados em:

```text
database/seed.sql
```

O banco é executado através do container Docker:

```text
construlink-postgres
```

---

## Segurança

Informações sensíveis de configuração não devem ser adicionadas ao repositório.

O arquivo `.env` é utilizado para armazenar configurações locais do ambiente e deve permanecer fora do controle de versão.

Arquivos de backup locais do banco também não devem ser versionados.

---

## Equipe

### Desenvolvimento

**Natã Samuel dos Santos Chaves**

**Fabiano Alves Santos**

Os integrantes atuam no desenvolvimento do sistema e participam das atividades definidas no processo Scrum.

### Product Owner / Professor

**Prof. Robson Silva**

Responsável pela orientação e acompanhamento do projeto acadêmico.

---

## Projeto acadêmico

O Construlink está sendo desenvolvido como projeto acadêmico utilizando práticas de desenvolvimento ágil, organização por Sprints e gerenciamento das atividades através do Jira.

A documentação deste README tem como objetivo facilitar a configuração do ambiente, a execução da aplicação e a compreensão da estrutura atual do projeto por qualquer integrante da equipe.

---

## Documentação complementar

Outras informações relacionadas ao projeto podem ser encontradas nos arquivos e ferramentas utilizadas pela equipe, incluindo:

```text
ACORDOS.md
database/schema.sql
database/seed.sql
compose.yaml
Jira
GitHub
```

---

## Construlink

**Construção, reforma e manutenção conectando clientes e profissionais.**