#!/bin/bash
set -e

# Function to test database connection
wait_for_db() {
    echo "Waiting for database to be ready..."
    for i in {1..30}; do
        if psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "SELECT 1" >/dev/null 2>&1; then
            echo "Database is ready!"
            return 0
        fi
        echo "Waiting for database... attempt $i/30"
        sleep 1
    done
    echo "Database connection timeout"
    return 1
}

# First, check if the database exists
DB_EXISTS=$(psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB'")

# Create database if it doesn't exist
if [ -z "$DB_EXISTS" ]; then
    echo "Creating database $POSTGRES_DB..."
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "CREATE DATABASE $POSTGRES_DB"
fi

# Load extensions only if they haven't been loaded
echo "Checking and loading PostGIS extensions into $POSTGRES_DB"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname="$POSTGRES_DB" <<-'EOSQL'
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
            CREATE EXTENSION postgis;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis_topology') THEN
            CREATE EXTENSION postgis_topology;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'fuzzystrmatch') THEN
            CREATE EXTENSION fuzzystrmatch;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis_tiger_geocoder') THEN
            CREATE EXTENSION postgis_tiger_geocoder;
        END IF;
    END;
    $$;
EOSQL

# Wait for database to be ready before seeding
if ! wait_for_db; then
    echo "Failed to connect to database. Exiting."
    exit 1
fi

# Check if the data needs to be seeded
should_seed=$(psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -tAc "
    SELECT CASE 
        WHEN NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'layers') 
        THEN 'true' 
        ELSE 'false' 
    END;
")

if [ "$should_seed" = "true" ]; then
    echo "Seeding database..."
    # Use the environment variables that are already working for psql
    POSTGRES_DB="$POSTGRES_DB" \
    POSTGRES_USER="$POSTGRES_USER" \
    POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
    python3 /docker-entrypoint-initdb.d/seed_database.py
else
    echo "Database already seeded."
fi