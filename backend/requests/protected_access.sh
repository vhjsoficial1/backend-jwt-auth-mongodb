# Acesso sem token
curl -X GET http://localhost:5000/api/protected

# Acesso com token inválido
curl -X GET http://localhost:5000/api/protected \
  -H "Authorization: Bearer token.invalido.123"

# Primeiro faz login para obter token válido
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senhaSegura123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

# Acesso com token válido
curl -X GET http://localhost:5000/api/protected \
  -H "Authorization: Bearer $TOKEN"