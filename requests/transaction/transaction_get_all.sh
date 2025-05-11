#!/bin/bash

# Primeiro faz login para obter token
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

# Obtém todas as transações
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $TOKEN"