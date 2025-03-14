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

def natural_language_to_sql(nl_query):
    """Convert NL query to SQL using a local Ollama LLM."""
    prompt = f"""
    Convert the following natural language query into a valid SQL statement for a PostGIS database.

    ### Database Schema
    The SQL query should reference the `test.properties` table, which has the following columns:
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

    ### Query Requirements
    - Ensure **all string comparisons are case-insensitive**.
    - If the query pertains to "name," search both `property_name` and `property_identifier`.
    - Always filter results to include only rows where `group_id = 114123`.

    ### Input
    Natural Language Query: "{nl_query}"

    ### Output
    Return only the valid SQL query.

    SQL:
        """
    ollama_url = "http://ollama:11434/api/generate"  # Ollama runs locally
    response = requests.post(ollama_url, json={"model": "llama3.2", "prompt": prompt, "stream": False})
    
    if response.status_code == 200:
        match = re.search(r"SELECT.*?;", response.text, re.DOTALL)
        if match:
            sql_query = match.group(0).strip()
            sql_query = sql_query.replace('\\n', ' ').replace('\\u003e', '>').replace('\\u003c', '<')
            print('the response is:', sql_query)
            # Wrap the generated SQL query to select only the id column
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