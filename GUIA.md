# Lava Rápido Gota Azul — React Native + Firebase Firestore

Sistema de gerenciamento de lava rápido. Projeto em [`lavarapido/`](lavarapido).

## 1. Modelagem NoSQL (para desenhar no brModeloWeb)

Todo documento também recebe `criadoEm` (timestamp) e, ao ser alterado, `alteradoEm`.

| Collection | Campos | Referências |
|---|---|---|
| **clientes** | nome (string), telefone (string), email (string), cpf (string) | — |
| **veiculos** | placa (string), marca (string), modelo (string), cor (string), clienteId (string), clienteNome (string) | clienteId → clientes |
| **servicos** | nome (string), descricao (string), preco (number), duracaoMin (number) | — |
| **funcionarios** | nome (string), cargo (string: Lavador/Polidor/Atendente/Gerente), telefone (string), email (string) | — |
| **agendamentos** | clienteId, clienteNome, veiculoId, veiculoDescricao, servicoId, servicoNome, funcionarioId, funcionarioNome, data ("dd/mm/aaaa"), hora ("hh:mm"), dataHoraOrdem ("aaaa-mm-dd hh:mm"), valor (number), status (Agendado/Em lavagem/Pronto/Entregue/Cancelado), observacao (string) | clienteId → clientes, veiculoId → veiculos, servicoId → servicos, funcionarioId → funcionarios |

Relacionamentos: um **cliente** tem vários **veículos** (1:N); um **agendamento** liga 1 cliente,
1 veículo, 1 serviço e 1 funcionário.

**Por que guardar o nome junto com o id?** No NoSQL não existe JOIN. Guardar `clienteNome`
ao lado de `clienteId` (desnormalização) permite mostrar a lista com uma única leitura.

## 2. Criar o projeto no Firebase

1. Acesse https://console.firebase.google.com e clique em **Criar um projeto** (ex.: `lava-rapido`).
2. Menu **Criação > Firestore Database > Criar banco de dados** → escolha a região
   `southamerica-east1 (São Paulo)` → **Iniciar no modo de teste**.
3. Na aba **Dados**, crie as 5 Collections: `clientes`, `veiculos`, `servicos`, `funcionarios`,
   `agendamentos` (o Firestore pede um primeiro documento; pode criar um de exemplo e apagar depois,
   ou deixar o próprio app criar ao cadastrar).
4. Em **Configurações do projeto (engrenagem) > Seus apps**, clique no ícone **Web `</>`**,
   dê um nome (ex.: `lavarapido-app`) e registre o app.
5. Copie o objeto `firebaseConfig` que aparece e cole os valores em
   [`lavarapido/firebaseConfig.js`](lavarapido/firebaseConfig.js), no lugar de `COLE_AQUI`.

> O "modo de teste" libera leitura/escrita por 30 dias. Se passar da data, vá em
> **Firestore > Regras** e renove a data em `request.time < timestamp.date(...)`.

## 3. Rodar

```bash
cd lavarapido
npm install
npx expo start
```

- **Celular:** leia o QR Code com o app **Expo Go** (projeto está no SDK 54).
- **Web:** aperte `w` no terminal (ou rode `npm run web`).

## 4. Estrutura do código

```
lavarapido/
├── App.js                     Menu principal (Drawer) com as 5 Collections
├── firebaseConfig.js          Conexão com o Firebase / Firestore
├── services/firestore.js      Funções do CRUD: cadastrar, ouvirColecao, alterar, excluir
├── navigation/Pilhas.js       Stack de cada Collection: Menu -> Cadastro / Lista
├── components/                Campo, Botao, Seletor, ItemLista, ListaDocumentos, MenuColecao, alertas
├── screens/Inicio.js          Tela inicial com o total de cada Collection
└── screens/<colecao>/         CadastroX.js (cadastrar e alterar) + ListaX.js (listar e excluir)
```

Menu do sistema:

```
MENU
├── Início
├── Clientes      ── Cadastrar Cliente  |  Listar / Alterar / Excluir
├── Veículos      ── Cadastrar Veículo  |  Listar / Alterar / Excluir
├── Serviços      ── Cadastrar Serviço  |  Listar / Alterar / Excluir
├── Funcionários  ── Cadastrar Funcionário | Listar / Alterar / Excluir
└── Agendamentos  ── Cadastrar Agendamento | Listar / Alterar / Excluir
```

Ordem sugerida para cadastrar na demonstração: Clientes → Veículos → Serviços → Funcionários →
Agendamentos (o agendamento usa as outras quatro).

## 5. Roteiro da documentação em Word

1. Capa: nome do projeto, tema (lava rápido), integrantes do grupo
2. Descrição do sistema
3. Modelo NoSQL (print do brModeloWeb + tabela da seção 1)
4. Criação e configuração do projeto no Firebase (prints dos passos da seção 2)
5. Collections no Firestore (print da aba Dados)
6. Registro do app Web no Firebase (print da tela `</>`)
7. Configuração do Firebase no React Native (`firebaseConfig.js`)
8. Telas e menu (prints do app no celular e na Web)
9. CRUD de cada Collection (prints de cadastrar, listar, alterar, excluir)
10. Prints do Firestore com os dados cadastrados
11. Principais trechos de código: `firebaseConfig.js`, `services/firestore.js`,
    um `CadastroX.js` e um `ListaX.js`, `App.js` (menu)
