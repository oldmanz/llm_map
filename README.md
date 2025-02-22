# LLM Map

## Overview

This project uses FastAPI to create a web service that converts natural language queries into SQL statements for a PostGIS database. The service leverages a local Ollama LLM model to perform the conversion.

## Setup

### Prerequisites

- Python 3.6+
- PostgreSQL with PostGIS extension
- Ollama LLM model running locally

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd llm_map
   ```

### How to run fastapi

uvicorn backend:app --reload --port 8001

### How to run local Ollama

ollama start
ollama run llama3.2
