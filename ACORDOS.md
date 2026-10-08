# Acordos da equipe - Contrulink

Time: Natã Samuel dos Santos Chaves e Fabiano Alves Santos
PO: Prof. Robson Silva

Como somos só os dois, os papéis de Scrum Master e Responsável pela Qualidade vão se revezando entre a gente. No começo:

- Natã: Scrum Master
- Fabiano: Responsável pela Qualidade

Os dois somos desenvolvedores também, então na prática todo mundo puxa task e codifica.

## Quando um item pode entrar na sprint (Definition of Ready)

- já tem critério de aceite escrito
- já foi estimado em story points
- dá pra terminar dentro da sprint

## Quando um item tá pronto de verdade (Definition of Done)

- código já foi integrado na `develop` por meio de PR aprovado
- tem teste automatizado (isso vale a partir da sprint 3)
- pipeline passando (a partir da sprint 5)
- outro da equipe revisou e aprovou o PR
- documentação foi atualizada se precisava
- item movido pra "Done" no Jira

## Branch

Usamos esse padrão:
- `main` - código estável e funcionando
- `develop` - integração das entregas
- `feature/nome-da-feature` - pra features novas
- `fix/nome-do-bug` - pra correções

Toda branch de trabalho deve ser criada a partir da `develop`, nunca da `main`.
Não fazemos commits diretos na `develop` nem na `main`; as alterações chegam à `develop` por PR.

## Commit

Seguindo o padrão conventional commits, tipo:

```
feat: adiciona upload de foto no portfolio
fix: corrige filtro de busca por cidade
docs: atualiza readme
```

## PR

- deve ter a `develop` como branch de destino
- precisa da aprovação de outro integrante da equipe e do Prof. Robson antes do merge
- quem abriu não aprova o próprio PR
- escrever no PR o que foi feito e como testar

## Board

Tá tudo no Jira, projeto CONSTRULINK. Combinamos de manter atualizado sempre que mudar alguma coisa, não só deixar pra última hora antes da aula.
