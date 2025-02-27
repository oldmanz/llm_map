FROM ubuntu:latest

# Install necessary dependencies
RUN apt-get update && apt-get install -y wget curl

# Download and install Ollama
RUN wget https://ollama.ai/install.sh && \
    chmod +x install.sh && \
    ./install.sh

# Copy the script to start Ollama and pull the model
COPY start_ollama.sh /start_ollama.sh
RUN chmod +x /start_ollama.sh

CMD ["/start_ollama.sh"]