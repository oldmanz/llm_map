#!/bin/bash

# Start the Ollama app in the background
ollama serve &

# Wait for the Ollama app to start
sleep 10

# Pull the Llama3 model
ollama pull $LLM_MODEL

# Keep the container running
tail -f /dev/null