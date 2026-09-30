# Guia de Preparação do Ambiente — Construlink

Este documento apresenta os passos para preparar a máquina de desenvolvimento antes de iniciar a implementação das próximas tarefas do Construlink.

O objetivo é garantir que o ambiente esteja funcionando corretamente antes do início das novas Sprints e da implementação das telas.

---

## 1. Pré-requisitos

Antes de começar, a máquina deve possuir:

- Git;
- Node.js;
- npm;
- Docker;
- Docker Compose;
- PostgreSQL executado através do Docker.

O projeto utiliza:

- React + Vite no frontend;
- Node.js + Express no backend;
- PostgreSQL 16 no banco de dados;
- Docker Compose para execução do PostgreSQL.

---

## 2. Clonar o repositório

Abra o terminal e escolha uma pasta onde o projeto será armazenado.

Execute:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta do projeto:

```bash
cd Contrulink
```

Verifique o repositório:

```bash
git status
```

---

## 3. Verificar a estrutura do projeto

A estrutura principal esperada é:

```text
Contrulink/
├── backend/
├── database/
├── frontend/
├── compose.yaml
├── ACORDOS.md
├── .gitignore
└── README.md
```

Os arquivos importantes para o ambiente são:

```text
compose.yaml
database/schema.sql
database/seed.sql
backend/
frontend/
```

---

## 4. Configuração do ambiente

O projeto utiliza variáveis de ambiente para a configuração da conexão com o banco de dados.

O arquivo `.env` é utilizado localmente e não deve ser enviado para o GitHub.

Antes de iniciar o backend, é necessário garantir que o ambiente local esteja configurado de acordo com a configuração utilizada pelo projeto.

> Não adicionar informações sensíveis ao repositório.

---

## 5. Iniciar o PostgreSQL com Docker

Na raiz do projeto, execute:

```bash
docker compose up -d
```

Verifique os serviços:

```bash
docker compose config --services
```

O serviço esperado é:

```text
db
```

Agora verifique o container:

```bash
docker compose ps
```

O container esperado é:

```text
construlink-postgres
```

O PostgreSQL deve aparecer como ativo e saudável.

---

## 6. Banco de dados

O projeto possui dois arquivos relacionados à estrutura e aos dados do banco:

```text
database/schema.sql
database/seed.sql
```

### `schema.sql`

Contém a estrutura do banco de dados.

Atualmente existem as seguintes tabelas:

```text
usuario
cliente
profissional
trabalho_realizado
servico
oferta_servico
conversa
mensagem
```

### `seed.sql`

Contém dados fictícios utilizados durante o desenvolvimento e os testes.

Entre os dados existentes estão profissionais, serviços e trabalhos realizados.

---

## 7. Conferir o banco

O ambiente atual utiliza o banco:

```text
construlink
```

O PostgreSQL utilizado pelo projeto é:

```text
PostgreSQL 16
```

O container utilizado é:

```text
construlink-postgres
```

A porta utilizada pelo PostgreSQL é:

```text
5432
```

Antes de iniciar o desenvolvimento das telas, é importante confirmar que o PostgreSQL está funcionando corretamente.

---

## 8. Preparar o Backend

Abra um terminal separado.

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Depois inicie o backend:

```bash
npm start
```

O servidor deve ser iniciado na porta:

```text
3000
```

A API estará disponível em:

```text
http://localhost:3000
```

---

## 9. Testar o Backend

Com o backend em execução, abra outro terminal e teste a API.

### Teste principal

```bash
curl http://127.0.0.1:3000/api/
```

O resultado esperado é:

```json
{
  "mensagem": "API do Construlink funcionando!"
}
```

---

### Testar serviços

```bash
curl http://127.0.0.1:3000/api/servicos
```

O endpoint deve retornar os serviços cadastrados.

---

### Testar profissionais

```bash
curl http://127.0.0.1:3000/api/profissionais
```

O endpoint deve retornar os profissionais cadastrados.

---

### Testar um profissional específico

```bash
curl http://127.0.0.1:3000/api/profissionais/2
```

---

### Testar trabalhos realizados

```bash
curl http://127.0.0.1:3000/api/profissionais/2/trabalhos
```

---

### Testar serviços de um profissional

```bash
curl http://127.0.0.1:3000/api/profissionais/2/servicos
```

---

### Testar profissional inexistente

```bash
curl http://127.0.0.1:3000/api/profissionais/999
```

O resultado esperado é:

```json
{
  "mensagem": "Profissional não encontrado."
}
```

---

## 10. Preparar o Frontend

Abra outro terminal.

Na raiz do projeto, entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Depois execute:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local utilizado para acessar o frontend.

---

## 11. Executar o ambiente completo

Durante o desenvolvimento, a estrutura esperada é:

```text
Terminal 1
    |
    └── Docker / PostgreSQL

Terminal 2
    |
    └── Backend / Node.js + Express

Terminal 3
    |
    └── Frontend / React + Vite
```

O fluxo geral é:

```text
Docker
   |
   v
PostgreSQL
   |
   v
Backend / API
   |
   v
Frontend
```

---

## 12. Verificação antes de começar as tarefas das telas

Antes de iniciar a implementação das novas tarefas, confirmar:

- [ ] Repositório clonado corretamente;
- [ ] Git funcionando;
- [ ] Docker funcionando;
- [ ] Container `construlink-postgres` funcionando;
- [ ] PostgreSQL saudável;
- [ ] Banco `construlink` disponível;
- [ ] Dependências do backend instaladas;
- [ ] Backend iniciado na porta 3000;
- [ ] Endpoint `/api/` funcionando;
- [ ] Endpoint `/api/servicos` funcionando;
- [ ] Endpoint `/api/profissionais` funcionando;
- [ ] Dependências do frontend instaladas;
- [ ] Frontend iniciado pelo Vite.

---

## 13. Antes de implementar uma nova tarefa

Depois que o ambiente estiver funcionando, não iniciar diretamente a implementação.

Primeiro:

1. Verificar a tarefa correspondente no Jira.
2. Conferir o objetivo da tarefa.
3. Conferir os critérios de aceitação.
4. Conferir as dependências da tarefa.
5. Verificar se existe uma branch definida para a tarefa.
6. Criar ou utilizar a branch correspondente.
7. Atualizar a branch conforme o fluxo definido pela equipe.
8. Implementar somente o que estiver definido na tarefa.
9. Testar a funcionalidade.
10. Fazer o commit.
11. Enviar a branch para o GitHub.
12. Criar o Pull Request.
13. Solicitar revisão.

---

## 14. Convenção de commits

Os commits devem seguir o padrão utilizado pelo projeto:

```text
tipo(SCRUM-XXX): descrição curta
```

Exemplo:

```text
feat(SCRUM-265): integra conexão com PostgreSQL
```

Tipos utilizados no projeto incluem:

```text
feat
fix
chore
docs
refactor
test
```

---

## 15. Regra importante para as próximas telas

A implementação das telas deve considerar a estrutura existente do projeto.

Não criar uma estrutura paralela de banco, backend ou frontend sem verificar primeiro o que já existe.

Antes de implementar uma nova funcionalidade:

```text
Jira
  ↓
Requisitos da tarefa
  ↓
Dependências
  ↓
Estrutura existente
  ↓
Implementação
  ↓
Teste
  ↓
Commit
  ↓
Pull Request
  ↓
Review
```

O objetivo é manter a continuidade entre as Sprints e evitar que uma nova implementação fique desconectada do que já foi desenvolvido.

---

## 16. Ambiente pronto

A máquina pode ser considerada pronta para iniciar as próximas tarefas quando:

```text
Docker
   ↓
PostgreSQL
   ↓
Banco Construlink
   ↓
Backend
   ↓
API funcionando
   ↓
Frontend funcionando
   ↓
Ambiente pronto para desenvolvimento
```

A partir desse ponto, o desenvolvimento das telas deve seguir as tarefas e critérios definidos no Jira.

---

## 17. Referências do projeto

Arquivos principais:

```text
README.md
ACORDOS.md
compose.yaml
database/schema.sql
database/seed.sql
backend/
frontend/
```

Ferramentas utilizadas:

```text
Git
GitHub
Docker
Node.js
React
PostgreSQL
Jira
```

---

## Conclusão

Este guia deve ser utilizado para preparar o ambiente de desenvolvimento antes do início das próximas tarefas do Construlink.

O objetivo é garantir que todos os integrantes trabalhem sobre o mesmo projeto, utilizando a mesma estrutura de backend, frontend e banco de dados.

Depois que todas as verificações forem concluídas, o ambiente estará preparado para iniciar a implementação das próximas funcionalidades e telas definidas nas Sprints.