from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse

import psycopg2
import json
import requests
from shapely.geometry import shape
from geojson import Feature, FeatureCollection
import re
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9001"],  # Adjust this to your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
DB_CONFIG = {
    "dbname": "llmmap",
    "user": "postgres",
    "password": "postgres",
    "host": "db",
    "port": "5432"
}

def query_postgis(sql_query):
    """Execute SQL query and return GeoJSON."""
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute(sql_query)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    print('the count of rows are:', len(rows))
    ids = []
    for row in rows:
        ids.append(row[0])
    
    return ids

def get_properties_prompt(nl_query):
    """Return the prompt for the properties table."""
    prompt = f"""
    Convert the following natural language query into a valid SQL statement for a PostGIS database.

    ### Database Schema
    The SQL query should reference the `test.properties` table, which has the following columns:
    - `id` (INT4, NOT NULL)
    - `property_identifier` (TEXT, NULL)
    - `phase` (TEXT, NULL)
    - `address` (TEXT, NULL)
    - `city` (TEXT, NULL)
    - `county` (TEXT, NULL)
    - `state` (TEXT, NULL) — states are written in full, all lowercase (e.g., 'california')
    - `zip` (TEXT, NULL)
    - `property_type` (TEXT, NULL)
    - `property_name` (TEXT, NULL)
    - `property_acres` (FLOAT8, NULL)
    - `impervious_acres` (FLOAT8, NULL)
    - `group_id` (INT4, NULL)
    - `owner` (TEXT, NULL)
    - `acquisition_portfolio` (TEXT, NULL)

    ### Query Requirements
    - Ensure **all string comparisons are case-insensitive**.
    - If the query pertains to "name," search both `property_name` and `property_identifier`.
    - Always filter results to include only rows where `group_id = 114123`.
    - If the query has the words empty or null, check for null values and empty strings in the column.
    - Always include the `id` column in the SELECT statement.

    ### Input
    Natural Language Query: "{nl_query}"

    ### Output
    Return only the valid SQL query.

    SQL:
    """
    return prompt

def get_parks_prompt(nl_query):
    """Return the prompt for the parks and fountains tables."""
    prompt = f"""
    Convert the following natural language query into a valid SQL statement for a PostGIS database.
    
    ### Database Schema
    The database contains the following tables:

    1. `london.parks`:
       - `id` (INT4, NOT NULL)
       - `osm_id` (TEXT, NULL)
       - `name` (TEXT, NULL)
       - `operator` (TEXT, NULL)
       - `note` (TEXT, NULL)
       - `geom` (GEOMETRY, NULL)

    2. `london.fountains`:
       - `id` (INT4, NOT NULL)
       - `osm_id` (TEXT, NULL)
       - `name` (TEXT, NULL)
       - `note` (TEXT, NULL)
       - `geom` (GEOMETRY, NULL)

    ### Query Requirements
    - Ensure **all string comparisons are case-insensitive**.
    - If the query involves spatial relationships (e.g., "inside," "within," "near"), use appropriate PostGIS functions like `ST_Within` or `ST_Intersects`.
    - If the query has the words empty or null, check for null values and empty strings in the column.
    - Always include the `id` column in the SELECT statement.

    ### Example Queries
    - Find all fountains inside parks: Use `ST_Within(fountains.geom, parks.geom)`.
    - Find all parks that contain fountains: Use `ST_Within(fountains.geom, parks.geom)` with a `JOIN`.

    ### Input
    Natural Language Query: "{nl_query}"

    ### Output
    Return only the valid SQL query.

    SQL:
    """
    return prompt

def natural_language_to_sql(nl_query):
    """Convert NL query to SQL using a local Ollama LLM."""
    prompt = get_parks_prompt(nl_query)
    ollama_url = "http://ollama:11434/api/generate"  # Ollama runs locally
    response = requests.post(ollama_url, json={"model": "llama3.2", "prompt": prompt, "stream": False})
    
    if response.status_code == 200:
        match = re.search(r"SELECT.*?;", response.text, re.DOTALL)
        if match:
            sql_query = match.group(0).strip()
            sql_query = sql_query.replace('\\n', ' ').replace('\\u003e', '>').replace('\\u003c', '<')
            print('the response is:', sql_query)
            if "id" not in sql_query.lower():
                sql_query = sql_query.replace("SELECT", "SELECT id, ", 1)
            sql_query = f"SELECT id FROM ({sql_query[:-1]}) AS subquery;"
            return sql_query
        else:
            return "ERROR: SQL query not found in the response."
    else:
        return "ERROR: Failed to get a valid response from the API."

@app.get("/query")
def query_map(nl_query: str = Query(..., description="Natural language query")):
    sql_query = natural_language_to_sql(nl_query)
    print('-----------------------------------------------------------------------')
    ids = query_postgis(sql_query)
    return JSONResponse(content={"ids": ids})

@app.get("/properties")
def get_properties():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("SELECT id, st_asgeojson(geom) FROM test.properties WHERE group_id = 114123 and geom is not null and city = 'Portland'")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    features = []
    print('the count of rows are:', len(rows))
    for row in rows:
        geom = json.loads(row[1])
        feature = Feature(geometry=geom, properties={"id": row[0]})
        features.append(feature)

    collection = FeatureCollection(features)
    return JSONResponse(content=collection)

@app.get("/parks")
def get_parks():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("SELECT id, st_asgeojson(geom) FROM london.parks")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    features = []
    print('the count of rows are:', len(rows))
    for row in rows:
        geom = json.loads(row[1])
        feature = Feature(geometry=geom, properties={"id": row[0]})
        features.append(feature)

    collection = FeatureCollection(features)
    return JSONResponse(content=collection)

@app.get("/get-park-popup-properties")
def get_park_popup_properties(park_id: int):
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM london.parks WHERE id = {park_id}")
    row = cur.fetchone()
    # column_names = [desc[0] for desc in cur.description] 
    column_names = ['id', 'osm_id', 'name', 'operator', 'note']
    cur.close()
    conn.close()

    if row:
        properties = {column_names[i]: row[i] for i in range(len(column_names))}
        return JSONResponse(content=properties)
    else:
        return JSONResponse(content={"error": "Park not found."})

@app.get("/test")
def return_test():
    print('the response is:', 'Hello, Nat Evatt!')
    return JSONResponse(content={"message": "Hello, Nat Evatt!"})

@app.get("/test-ollama")
def test_ollama():
    print('i am testing ollama again')
    ollama_url = "http://ollama:11434/api/generate"  # Use the service name defined in docker-compose.yml
    prompt = "Test prompt for llama3.2"
    response = requests.post(ollama_url, json={"model": "llama3.2", "prompt": prompt, "stream": False})
    
    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=response.status_code, detail="Failed to connect to Ollama service")