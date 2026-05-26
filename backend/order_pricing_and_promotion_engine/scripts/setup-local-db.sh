#!/usr/bin/env bash
set -euo pipefail

# Local Postgres defaults (override via env when needed)
CONTAINER_NAME="${DB_CONTAINER_NAME:-order-pricing-postgres}"
POSTGRES_DB="${DB_NAME:-order_pricing}"
POSTGRES_USER="${DB_USERNAME:-postgres}"
POSTGRES_PASSWORD="${DB_PASSWORD:-postgres}"
POSTGRES_PORT="${DB_PORT:-5432}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
SEED_SQL_PATH="${PROJECT_DIR}/../order_pricing_promotion_engine_database.sql"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed or not in PATH."
  echo "Install Docker Desktop: https://www.docker.com/products/docker-desktop/"
  exit 1
fi

if [[ ! -f "${SEED_SQL_PATH}" ]]; then
  echo "Error: seed SQL file not found at ${SEED_SQL_PATH}"
  exit 1
fi

container_exists() {
  docker ps -a --format '{{.Names}}' | grep -qx "${CONTAINER_NAME}"
}

if ! container_exists; then
  echo "Creating postgres container: ${CONTAINER_NAME}"
  docker run -d \
    --name "${CONTAINER_NAME}" \
    -e POSTGRES_DB="${POSTGRES_DB}" \
    -e POSTGRES_USER="${POSTGRES_USER}" \
    -e POSTGRES_PASSWORD="${POSTGRES_PASSWORD}" \
    -p "${POSTGRES_PORT}:5432" \
    postgres:16
else
  echo "Container ${CONTAINER_NAME} already exists."
fi

if [[ "$(docker inspect -f '{{.State.Running}}' "${CONTAINER_NAME}")" != "true" ]]; then
  echo "Starting container ${CONTAINER_NAME}"
  docker start "${CONTAINER_NAME}" >/dev/null
fi

echo "Waiting for Postgres to be ready..."
until docker exec "${CONTAINER_NAME}" pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" >/dev/null 2>&1; do
  sleep 1
done

echo "Resetting schema..."
docker exec -i "${CONTAINER_NAME}" psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -v ON_ERROR_STOP=1 <<'SQL'
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
SQL

echo "Importing seed data from ${SEED_SQL_PATH}"
docker exec -i "${CONTAINER_NAME}" psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -v ON_ERROR_STOP=1 < "${SEED_SQL_PATH}"

cat <<EOF

Local database is ready.

Connection info (defaults match application.properties):
  DB_URL=jdbc:postgresql://localhost:${POSTGRES_PORT}/${POSTGRES_DB}
  DB_USERNAME=${POSTGRES_USER}
  DB_PASSWORD=${POSTGRES_PASSWORD}

Run backend:
  cd backend/order_pricing_and_promotion_engine
  mvn spring-boot:run

Optional: export env vars if you changed ports or credentials above.
EOF
