FROM postgis/postgis:latest

ENV POSTGRES_DB=llmmap
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Install Python and other necessary packages
RUN apt-get update && apt-get install -y python3 python3-pip

# Install required Python packages
RUN pip3 install psycopg2-binary geojson

# Copy the seed script, init-db.sh, and central_london_geodata folder into the container
COPY . /docker-entrypoint-initdb.d/


EXPOSE 5432