# JWT Authentication MongoDB - Atividade IV v2

Este é um projeto backend construído com Node.js, Express e MongoDB, fornecendo autenticação básica via token JWT e rotas protegidas. Esta versão inclui funcionalidades de CRUD para Transações Financeiras, Lista de Tarefas e Lista de Compras.

# Tecnologias Utilizadas

<div align="center" style="display: flex; justify-content: center; align-items: center; gap: 40px; margin: 20px 0;">
  <img src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*9oOlDJKiLq1KhGoOivv51A.png" alt="Node.js" height="60" style="height: 120px; object-fit: contain;">
  <img src="https://jwt.io/img/logo-asset.svg" alt="JWT" height="60" style="height: 80px; object-fit: contain;">
  <img src="https://webassets.mongodb.com/_com_assets/cms/mongodb-logo-rgb-j6w271g1xn.jpg" alt="MongoDB" height="60" style="height: 60px; object-fit: contain;">
</div>

## Rotas

### Autenticação

#### `[POST] /api/auth/login`
- Gera um token JWT para acessar a área protegida via autenticação.

**Parâmetros (body):**
```json
{
    "email": "string",
    "password": "string"
}
```

#### `[POST] /api/auth/register`
- Cadastra um novo usuário, salva no banco de dados (e sua senha é salva em hash).

**Parâmetros (body):**
```json
{
    "name": "string",
    "email": "string",
    "password": "string"
}
```

#### `[GET] /api/protected`
- Acessa a área a área protegida (exemplo de rota protegida).

### Transações Financeiras (`/api/transactions`)
Todas as rotas de transações financeiras requerem autenticação JWT.

- **`[POST] /`**: Cria uma nova transação.
  - Corpo da requisição: `{ "description": "string", "amount": number, "type": "income"|"expense", "date": "YYYY-MM-DD" (opcional) }`
- **`[GET] /`**: Lista todas as transações do usuário autenticado.
- **`[GET] /:id`**: Retorna detalhes de uma transação específica.
- **`[PUT] /:id`**: Atualiza todos os dados de uma transação.
  - Corpo da requisição: `{ "description": "string", "amount": number, "type": "income"|"expense", "date": "YYYY-MM-DD" (opcional) }`
- **`[DELETE] /:id`**: Remove uma transação.

## Vídeo Explicativo (Original - Atividade IV)

[Vídeo de Execução no Postman](https://youtu.be/G2WIVeRk-Gg)

## Como Executar

1. Clone o repositório.
2. Navegue até a pasta `backend`.
3. Crie um arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis:
   ```
   MONGODB_URI=sua_string_de_conexao_mongodb
   JWT_SECRET=seu_segredo_jwt
   PORT=5000 (ou outra porta de sua preferência)
   ```
4. Instale as dependências: `npm install`
5. Inicie o servidor: `npm start` ou `npm run dev` (para nodemon)

## Scripts de Exemplo de Requisições

Consulte a pasta `requests/` para scripts `.sh` com exemplos de uso das novas rotas (sucesso e erro).
