#!/bin/bash

# Testes sem token
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"description":"Teste","amount":100,"type":"expense","category":"food"}'

# Testes com token inválido
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token.invalido" \
  -d '{"description":"Teste","amount":100,"type":"expense","category":"food"}'

# Testes com dados inválidos (após login)
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

# Sem description
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount":100,"type":"expense","category":"food"}'

# Valor negativo
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description":"Teste","amount":-100,"type":"expense","category":"food"}'