FROM postgis/postgis:latest

ENV POSTGRES_DB=llmmap
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

COPY init-db.sh /docker-entrypoint-initdb.d/

EXPOSE 5432