# JWT Authentication MongoDB - Atividade IV v1

Este é um projeto backend construído com Node.js, Express e MongoDB, fornecendo autenticação básica via token JWT e rotas protegidas.

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
- Acessa a área a área protegida.

## Vídeo Explicativo

[Vídeo de Execução no Postman](https://youtu.be/G2WIVeRk-Gg)
