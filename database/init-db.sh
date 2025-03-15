#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE DATABASE llmmap;
EOSQL

echo "Loading PostGIS extensions into $POSTGRES_DB"
"${psql[@]}" --dbname="$POSTGRES_DB" <<-'EOSQL'
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS postgis_topology;
    -- Reconnect to update pg_setting.resetval
    -- See https://github.com/postgis/docker-postgis/issues/288
    \c
    CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
    CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;
EOSQL

# Check if the data is already in the database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM test.properties) THEN
            RAISE NOTICE 'Seeding database...';
            \! python3 /docker-entrypoint-initdb.d/seed_database.py
        ELSE
            RAISE NOTICE 'Database already seeded.';
        END IF;
    END
    \$\$;
EOSQL