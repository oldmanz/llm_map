import os
import psycopg2
import geojson

# Database connection configuration
DB_CONFIG = {
    "dbname": os.getenv("POSTGRES_DB"),
    "user": os.getenv("POSTGRES_USER"),
    "password": os.getenv("POSTGRES_PASSWORD"),
    "host": "localhost",
    "port": "5432"
}

# Path to the GeoJSON files
GEOJSON_FOLDER = '/docker-entrypoint-initdb.d/central_london_geodata'

def create_schemas(cur):
    # Create the schema if it does not exist
    cur.execute("CREATE SCHEMA IF NOT EXISTS layers;")
    cur.execute("CREATE SCHEMA IF NOT EXISTS main;")

def create_table(cur, table_name, properties):
    columns = ['id SERIAL PRIMARY KEY']
    for prop, value in properties.items():
        if isinstance(value, str):
            columns.append(f'"{prop}" TEXT')
        elif isinstance(value, int):
            columns.append(f'"{prop}" INT')
        elif isinstance(value, float):
            columns.append(f'"{prop}" FLOAT8')
        else:
            columns.append(f'"{prop}" TEXT')  # Default to TEXT for unknown types

    columns.append('geom GEOMETRY')
    columns_sql = ', '.join(columns)
    create_table_sql = f'CREATE TABLE IF NOT EXISTS layers."{table_name}" ({columns_sql});'
    cur.execute(create_table_sql)

def gather_unique_properties(geojson_data):
    unique_properties = {}
    for feature in geojson_data['features']:
        for key, value in feature['properties'].items():
            if key not in unique_properties:
                unique_properties[key] = value
    return unique_properties

def created_saved_queries_table(cur):
    # Drop the existing table if it exists
    cur.execute("DROP TABLE IF EXISTS main.saved_queries;")
    
    # Create the saved queries table with the new schema
    create_table_sql = '''
        CREATE TABLE main.saved_queries (
            id SERIAL PRIMARY KEY, -- Auto-incrementing primary key
            nl_query TEXT NOT NULL, -- Natural language query
            sql_query TEXT NOT NULL, -- Corresponding SQL query
            primary_layer TEXT NOT NULL -- Primary layer for the query
        );
    '''
    cur.execute(create_table_sql)

def seed_database():
    # Connect to the database
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # Create the schema
    create_schemas(cur)

    created_saved_queries_table(cur)

    # Iterate over GeoJSON files in the folder
    for filename in os.listdir(GEOJSON_FOLDER):
        if filename.endswith('.geojson'):
            file_path = os.path.join(GEOJSON_FOLDER, filename)
            with open(file_path, 'r') as file:
                geojson_data = geojson.load(file)
                table_name = os.path.splitext(filename)[0]

                # Gather unique properties from all features
                if geojson_data['features']:
                    unique_properties = gather_unique_properties(geojson_data)
                    create_table(cur, table_name, unique_properties)

                # Insert data into the table
                for feature in geojson_data['features']:
                    geom = geojson.dumps(feature['geometry'])
                    properties = feature['properties']
                    columns = ', '.join([f'"{key}"' for key in properties.keys()])
                    values = ', '.join([f'%s' for _ in properties.values()])
                    insert_sql = f'INSERT INTO layers."{table_name}" ({columns}, geom) VALUES ({values}, ST_GeomFromGeoJSON(%s));'
                    cur.execute(insert_sql, list(properties.values()) + [geom])

    

    # Commit the transaction and close the connection
    conn.commit()
    cur.close()
    conn.close()

if __name__ == '__main__':
    seed_database()
    print('Database seeding completed.')