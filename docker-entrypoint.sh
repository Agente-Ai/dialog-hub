#!/bin/sh
# Script de inicialização para esperar o PostgreSQL estar pronto antes de iniciar a aplicação

set -e

# Função para verificar se o PostgreSQL está pronto
wait_for_postgres() {
  echo "Aguardando PostgreSQL..."
  until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
    echo "PostgreSQL não está disponível ainda - aguardando..."
    sleep 2
  done
  echo "PostgreSQL está disponível!"
}

# Verifica se estamos em ambiente Docker e se o host do DB não é localhost
if [ "$DB_HOST" != "localhost" ] && [ "$DB_HOST" != "127.0.0.1" ]; then
  wait_for_postgres
fi

# Executa a migração do banco de dados
echo "Executando migração do banco de dados..."
node database/migrate.js

# Executa o comando passado
exec "$@"
