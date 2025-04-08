import os
import psycopg2

# Database connection configuration
DB_CONFIG = {
    "dbname": os.getenv("POSTGRES_DB"),
    "user": os.getenv("POSTGRES_USER"),
    "password": os.getenv("POSTGRES_PASSWORD"),
    "host": "localhost",
    "port": "5432"
}

def apply_migration():
    # Connect to the database
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    try:
        # Read and execute the migration file
        with open('database/migrations/add_primary_layer.sql', 'r') as f:
            migration_sql = f.read()
            cur.execute(migration_sql)
        
        conn.commit()
        print("Migration applied successfully!")
    except Exception as e:
        print(f"Error applying migration: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    apply_migration() 