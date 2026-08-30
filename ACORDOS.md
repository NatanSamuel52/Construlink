# Acordos da equipe — Construlink

## Equipe

**Desenvolvedores:**

- Natã Samuel dos Santos Chaves
- Fabiano Alves Santos

**Product Owner / Professor:**

- Prof. Robson Silva

Como a equipe possui apenas dois desenvolvedores, os papéis de Scrum Master e Responsável pela Qualidade serão revezados entre os integrantes.

### Papéis iniciais

- Natã: Scrum Master
- Fabiano: Responsável pela Qualidade

Os dois integrantes também atuam como desenvolvedores e podem assumir e desenvolver qualquer tarefa do projeto.

---

# 1. Organização do desenvolvimento

O projeto será desenvolvido utilizando:

- React — Frontend
- Node.js + Express — Backend
- PostgreSQL — Banco de dados
- Docker — Ambiente e infraestrutura

O protótipo HTML/CSS/JavaScript existente será utilizado como referência visual e funcional para a implementação da aplicação real.

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

Toda tarefa desenvolvida deve estar vinculada a um item existente no Jira.

O Jira deve ser atualizado durante o desenvolvimento, e não somente antes da avaliação semanal.

---

# 3. Definition of Ready (DoR)

Uma tarefa pode entrar em uma Sprint quando:

- possui descrição clara;
- possui critérios de aceite escritos;
- foi estimada em Story Points;
- possui as dependências técnicas identificadas;
- a equipe entende o item sem precisar esclarecer informações básicas;
- é possível concluí-la dentro da Sprint.

Se uma tarefa não estiver suficientemente definida, ela deve ser esclarecida antes de entrar na Sprint.

---

# 4. Definition of Done (DoD)

Uma tarefa será considerada concluída quando:

- o desenvolvimento da tarefa estiver completo;
- os critérios de aceite forem atendidos;
- o código estiver funcionando;
- o Pull Request tiver sido revisado por outro integrante;
- o Pull Request tiver sido aprovado;
- o código tiver sido integrado à `main`;
- a documentação tiver sido atualizada quando necessário;
- a tarefa tiver sido movida para `Done` no Jira.

### Testes automatizados

A partir da Sprint 3, as tarefas que exigirem testes deverão possuir testes automatizados.

### Pipeline

A partir da Sprint 5, o pipeline deverá estar configurado e passando para as entregas que fizerem parte desse processo.

---

# 5. Branches

A equipe utilizará o GitHub Flow.

A `main` será a branch principal e deverá permanecer protegida, estável e integrada somente por Pull Requests.

Não serão realizados commits diretamente na `main`.

Cada tarefa deverá ser desenvolvida em uma branch própria, criada a partir da `main` atualizada.

### Padrão de branch

`feature/<id-da-tarefa>-<descricao>`

Exemplos:

`feature/123-cadastro-cliente`

`feature/123-login`

`feature/123-busca-profissionais`

Cada tarefa deve, preferencialmente, possuir sua própria branch.

### Fluxo de desenvolvimento

Jira → main atualizada → Branch da tarefa → Desenvolvimento → Commits → Pull Request para main → Code Review → Aprovação → Merge na main → Jira → Done

A `main` representa a versão integrada e estável do projeto.

As branches de funcionalidade são curtas e devem ser integradas à `main` por Pull Request após revisão.

---

# 6. Commits

Será utilizado o padrão Conventional Commits.

Formato:

`tipo(escopo): descrição`

Exemplos:

`feat(cadastro): adiciona cadastro de cliente`

`feat(login): implementa autenticação do usuário`

`feat(busca): implementa busca de profissionais`

`fix(login): corrige erro na autenticação`

`test(cadastro): adiciona testes do cadastro`

`docs(readme): atualiza instruções do projeto`

`refactor(busca): reorganiza componente de busca`

`chore(deps): atualiza dependencias`

Os commits devem:

- ser pequenos;
- representar uma mudança coesa;
- utilizar uma única categoria de alteração;
- possuir descrição no imperativo;
- utilizar letras minúsculas;
- não possuir ponto final na primeira linha.

Evitar commits genéricos como:

`alterações`

`coisas`

`teste`

`mudanças`

`final`

---

# 7. Pull Requests

Toda alteração destinada à `main` deve passar por Pull Request.

O PR deve conter:

- descrição do que foi desenvolvido;
- tarefa do Jira relacionada;
- informações sobre como testar;
- observações importantes, quando necessário.

### Revisão

- Quem criou o PR não aprova o próprio PR.
- O outro integrante deve revisar o código.
- O PR somente poderá ser integrado após a aprovação.
- Cada comentário da revisão deve ser corrigido ou justificado.
- Após o merge, a branch poderá ser removida quando não for mais necessária.

### Fluxo de uma tarefa

Tarefa no Jira → main atualizada → Branch da tarefa → Desenvolvimento → Commits → Testes → Pull Request para main → Code Review → Aprovação → Merge na main → Jira → Done

---

# 8. Desenvolvimento em dupla

Os dois integrantes são responsáveis pelo resultado final do projeto.

Não haverá divisão rígida de que um integrante será responsável somente pelo Frontend e o outro somente pelo Backend.

As tarefas serão distribuídas de acordo com a Sprint e a necessidade do projeto.

Quando possível, os integrantes poderão trabalhar em partes diferentes do sistema simultaneamente, evitando conflitos de código.

---

# 9. Entregas semanais

Como o projeto será acompanhado semanalmente pelo professor, cada Sprint deve produzir entregas reais e verificáveis.

Uma entrega pode incluir:

- funcionalidade implementada;
- tela desenvolvida;
- API funcionando;
- integração com banco de dados;
- testes;
- correção de bugs;
- configuração de infraestrutura.

O objetivo é evitar que o desenvolvimento fique concentrado apenas no planejamento ou em código não integrado.

---

# 10. GitHub

O GitHub será utilizado para armazenar e versionar o código-fonte.

A `main` será a branch principal de integração do projeto.

A `main` deverá permanecer estável e protegida contra commits diretos.

O histórico de commits e Pull Requests deve permitir acompanhar a evolução do desenvolvimento.

---

# 11. Sincronização entre Jira e GitHub

Jira e GitHub devem permanecer sincronizados.

Quando uma tarefa for desenvolvida:

Jira → Branch → Código → Commit → Pull Request → Code Review → Merge na main → Jira → Done

Dessa forma, cada tarefa concluída terá uma evidência correspondente no código do projeto.

As referências às tarefas do Jira devem ser utilizadas nos commits ou Pull Requests sempre que possível.

---

# 12. Regra principal

O objetivo da equipe é transformar progressivamente o protótipo existente em uma aplicação real.

Portanto:

**Planejar → Desenvolver → Testar → Revisar → Integrar → Entregar**

O planejamento no Jira deve sempre estar acompanhado de evolução real no GitHub.

A `main` será mantida protegida e estável, e toda alteração deverá passar pelo fluxo de branch, commit, Pull Request, Code Review e merge.
