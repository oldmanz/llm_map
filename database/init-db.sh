#!/bin/bash
set -e

echo "Loading PostGIS extensions into $POSTGRES_DB"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname="$POSTGRES_DB" <<-'EOSQL'
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS postgis_topology;
    -- Reconnect to update pg_setting.resetval
    -- See https://github.com/postgis/docker-postgis/issues/288
    \c
    CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
    CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;
EOSQL

python3 /docker-entrypoint-initdb.d/seed_database.py
