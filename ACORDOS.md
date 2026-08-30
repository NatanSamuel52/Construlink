# Acordos da equipe — Construlink

## Equipe

**Desenvolvedores:**

- Natã Samuel dos Santos Chaves
- Fabiano Alves Santos

**Product Owner / Professor:**

- Prof. Robson Silva

Como a equipe possui apenas dois desenvolvedores, os papéis de Scrum
Master e Responsável pela Qualidade serão revezados entre os integrantes.

### Papéis iniciais

- Natã: Scrum Master
- Fabiano: Responsável pela Qualidade

Os dois integrantes também atuam como desenvolvedores e podem assumir
e desenvolver qualquer tarefa do projeto.

---

# 1. Organização do desenvolvimento

O projeto será desenvolvido utilizando:

- React — Frontend
- Node.js + Express — Backend
- PostgreSQL — Banco de dados
- Docker — Ambiente e infraestrutura

O protótipo HTML/CSS/JavaScript existente será utilizado como referência
visual e funcional para a implementação da aplicação real.

O protótipo não será considerado a aplicação final.

---

# 2. Jira

O Jira será utilizado para controlar:

- Epics
- Stories
- Tasks
- Bugs
- Sprints
- Status das tarefas
- Critérios de aceite
- Story Points

Toda tarefa desenvolvida deve estar vinculada a uma tarefa existente
no Jira.

O Jira deve ser atualizado durante o desenvolvimento, e não somente
antes da avaliação semanal.

---

# 3. Definition of Ready (DoR)

Uma tarefa pode entrar em uma Sprint quando:

- possui descrição clara;
- possui critérios de aceite;
- foi estimada em Story Points;
- pertence a um Epic;
- possui informações suficientes para ser desenvolvida;
- é possível concluí-la dentro da Sprint.

Se uma tarefa não estiver suficientemente definida, ela deve ser
esclarecida antes de entrar na Sprint.

---

# 4. Definition of Done (DoD)

Uma tarefa será considerada concluída quando:

- o desenvolvimento da tarefa estiver completo;
- os critérios de aceite forem atendidos;
- o código estiver funcionando;
- os testes necessários tiverem sido realizados;
- o código tiver sido revisado por outro integrante;
- o Pull Request tiver sido aprovado;
- o código tiver sido integrado à `develop`;
- a documentação tiver sido atualizada quando necessário;
- a tarefa tiver sido movida para `Done` no Jira.

### Testes automatizados

A partir da Sprint 3, as tarefas que exigirem testes deverão possuir
testes automatizados.

### Pipeline

A partir da Sprint 5, o pipeline deverá estar configurado e passando
para as entregas que fizerem parte desse processo.

---

# 5. Branches

A branch `main` deve conter somente código integrado, estável e funcionando.

A branch `develop` será utilizada como a principal branch de integração
do desenvolvimento da equipe.

Não serão realizados commits diretamente na `main` ou na `develop`.

As funcionalidades e correções deverão ser desenvolvidas em branches
próprias e posteriormente integradas à `develop` por Pull Request.

Quando a versão estiver estável e pronta para entrega, a `develop` será
integrada à `main` por Pull Request.

### Padrões utilizados

```text
feature/nome-da-feature
fix/nome-do-bug
```

Exemplos:

```text
feature/cadastro-cliente
feature/login
feature/busca-profissionais
fix/erro-login
```

Cada tarefa deve, preferencialmente, possuir sua própria branch.

### Fluxo de desenvolvimento

```text
main
  ↑
  │ Pull Request
  │
develop
  ↑
  │ Pull Request
  │
feature/...
```

A `main` representa a versão estável do projeto.

A `develop` representa a versão em desenvolvimento e integração.

As branches `feature/...` e `fix/...` são utilizadas para implementar
funcionalidades e corrigir problemas.

---

# 6. Commits

Será utilizado o padrão Conventional Commits.

Exemplos:

```text
feat: adiciona cadastro de cliente
feat: implementa busca de profissionais
fix: corrige filtro por cidade
test: adiciona testes do cadastro
docs: atualiza readme
refactor: reorganiza componente de busca
```

Os commits devem ser pequenos e representar alterações relacionadas.

Evitar commits genéricos como:

```text
alterações
coisas
teste
mudanças
final
```

---

# 7. Pull Requests

Toda alteração destinada à `develop` deve passar por Pull Request.

A integração da `develop` com a `main` também deverá ser realizada
por Pull Request quando uma versão estiver pronta para entrega.

O PR deve conter:

- descrição do que foi desenvolvido;
- tarefa do Jira relacionada;
- informações sobre como testar;
- observações importantes, quando necessário.

### Revisão

- Quem criou o PR não aprova o próprio PR.
- O outro integrante deve revisar o código.
- O PR somente poderá ser integrado após a aprovação.
- Após o merge, a branch poderá ser removida quando não for mais
  necessária.

### Fluxo de uma tarefa

```text
Tarefa no Jira
   ↓
Branch feature/fix
   ↓
Desenvolvimento
   ↓
Testes
   ↓
Pull Request para develop
   ↓
Revisão do colega
   ↓
Aprovação
   ↓
Merge na develop
   ↓
Jira → Done
```

### Fluxo de entrega

```text
develop
   ↓
Pull Request
   ↓
Revisão
   ↓
Aprovação
   ↓
Merge na main
```

---

# 8. Desenvolvimento em dupla

Os dois integrantes são responsáveis pelo resultado final do projeto.

Não haverá divisão rígida de que um integrante será responsável
somente pelo Frontend e o outro somente pelo Backend.

As tarefas serão distribuídas de acordo com a Sprint e a necessidade
do projeto.

Quando possível, os integrantes poderão trabalhar em partes diferentes
do sistema simultaneamente, evitando conflitos de código.

---

# 9. Entregas semanais

Como o projeto será acompanhado semanalmente pelo professor, cada Sprint
deve produzir entregas reais e verificáveis.

Uma entrega pode incluir:

- funcionalidade implementada;
- tela desenvolvida;
- API funcionando;
- integração com banco de dados;
- testes;
- correção de bugs;
- configuração de infraestrutura.

O objetivo é evitar que o desenvolvimento fique concentrado apenas
no planejamento ou em código não integrado.

---

# 10. GitHub

O GitHub será utilizado para armazenar e versionar o código-fonte.

A `develop` será utilizada para integrar o desenvolvimento realizado
pela equipe.

A `main` deve representar a versão estável do projeto.

O histórico de commits e Pull Requests deve permitir acompanhar
a evolução do desenvolvimento.

---

# 11. Sincronização entre Jira e GitHub

Jira e GitHub devem permanecer sincronizados.

Quando uma tarefa for desenvolvida:

```text
Jira
  ↓
Branch
  ↓
Código
  ↓
Commit
  ↓
Pull Request
  ↓
Review
  ↓
Merge na develop
  ↓
Jira → Done
```

Dessa forma, cada tarefa concluída terá uma evidência correspondente
no código do projeto.

As referências às tarefas do Jira devem ser utilizadas nos commits
ou Pull Requests sempre que possível.

---

# 12. Regra principal

O objetivo da equipe é transformar progressivamente o protótipo
existente em uma aplicação real.

Portanto:

**Planejar → Desenvolver → Testar → Revisar → Integrar → Entregar**

O planejamento no Jira deve sempre estar acompanhado de evolução
real no GitHub.

A `develop` será o ponto de integração do desenvolvimento da equipe,
enquanto a `main` será mantida estável para versões prontas para entrega.