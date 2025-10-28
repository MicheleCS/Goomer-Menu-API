 📚 Goomer Menu API (Node.js, TypeScript, Express, PostgreSQL)

Este projeto é uma **API RESTful** para gerenciamento de produtos (itens de menu) e suas promoções, construída em Node.js com **TypeScript**, **Express** e utiliza *queries* SQL nativas com **PostgreSQL** como banco de dados.

---

## ⚙️ 1. Requisitos do Sistema

Para rodar este projeto, você precisará ter instalado:

* **Node.js** (v18+)
* **npm** (Node Package Manager)
* **Docker** e **Docker Compose** (Essenciais para rodar o banco de dados e a aplicação em ambiente isolado).

---

## 🚀 2. Como Rodar o Projeto Localmente

O projeto está configurado para ser executado via Docker Compose, garantindo que o banco de dados e a aplicação iniciem na ordem correta.
Antes de rodar npm run dev

### 2.1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (essenciais para o PostgreSQL):


# Configurações do Banco de Dados PostgreSQL (Alinhadas com docker-compose.yaml)
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=

# Configuração da Aplicação
PORT=
## 2.2. Inicialização via Docker Compose

Execute o comando abaixo na raiz do projeto.  
O Docker irá construir a imagem, subir o contêiner do PostgreSQL e, em seguida, iniciar a aplicação Node.js, executando as migrações automaticamente.

docker-compose up --build -d

---

🔎 2.3. Documentação e Teste da API (Swagger UI)
Após a inicialização, a API e toda a sua documentação interativa estão disponíveis no Swagger UI:

Serviço	URL de Acesso	Descrição
API REST (Base)	http://localhost:3000/	- Endpoint principal da aplicação.
Documentação (Swagger UI)	http://localhost:3000/goomer	- Interface interativa para explorar e testar todos os endpoints da API.

🧩 Rotas de Gerenciamento (/products e /promotions)
Estas rotas são usadas para as operações de CRUD (Criação, Leitura, Atualização e Exclusão) de itens do menu.

Products: Gerencia a base de dados de itens do menu (nome, preço, visibilidade, etc.).

Promotions: Gerencia as regras de desconto (preço promocional, dias e horários de vigência, etc.).

🌐 Rotas de Visualização Pública (/active - Menu)
Estas rotas são otimizadas para o consumo pelo front-end, retornando apenas os dados que estão ativos e visíveis no momento.

/products/active: 
Lista todos os produtos que estão marcados como visíveis.

/promotions/active: 
Lista apenas as promoções ativas no dia e hora exatos da requisição.

2.4. Limpeza (Se necessário)
Para derrubar os contêineres e destruir os dados persistidos do banco (necessário ao alterar migrações ou entidades):

docker-compose down -v
---
## 🛑 3. Desafios de Desenvolvimento (Troubleshooting)
O desenvolvimento em um ambiente Node moderno (ES Modules / NodeNext) com queries nativas do PostgreSQL introduziu desafios importantes, focando na consistência de dados e no gerenciamento de módulos.

🔧 Referência de Módulos (ESM)
Causa Principal: Conflito entre a sintaxe de módulos CommonJS (CJS) e o ambiente de execução ES Modules (ESM).

Solução Aplicada:

Configuração de "type": "module" no package.json.

Uso de module: "NodeNext" e moduleResolution: "NodeNext" no tsconfig.json.

🗺️ Resolução de Path Aliases
Causa Principal: O ts-node e o Node.js não conseguiam resolver os aliases de caminho (ex: shared/).

Solução Aplicada:

Uso do registrador tsconfig-paths/register no script de desenvolvimento (ts-node -r ... --esm) para mapear os aliases de caminho em tempo de execução, mas por fim tive resolver manualmente colocando ./ em alguns caminhos e importar em JS

🐍 Ambiguidade em Queries (snake_case vs camelCase)
Causa Principal: Uso de JOIN ou retorno inconsistente entre o nome da coluna do banco (snake_case) e o nome esperado pelo código (camelCase).

Solução Aplicada:

Prefixação: Utilização de aliases de tabela (t1.) para resolver ambiguidades.

Aliasing (AS): Uso consistente de AS "camelCase" na constante PROMOTION_COLUMNS para padronizar o mapeamento no Repository.


🗓️ Mapeamento de Data (JSONB)
Causa Principal: Colunas do PostgreSQL do tipo JSONB (como days_of_week) retornam como strings e precisam ser parseadas.

Solução Aplicada:

Implementação de JSON.parse() no Repository para converter o dado para o formato de array esperado pelo TypeScript.
