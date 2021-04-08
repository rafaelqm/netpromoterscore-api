# Project NPS API

## Simple project in Typescript and NodeJS

This is a NodeJS API to save the score of an product or company 
and calculate the Net Promoter Score (NPS)

## Docker ready
To avoid the need to install Node in version 14.16.1 and the Postgres 13.2, it comes a docker-compose.yml file.
To initialize the database Postgres and a container to admin it (adminer):
```
docker-compose up -d db adminer
```

And to the application just run the docker compose and inside bash run the **yarn start**.

```
docker-compose run --rm --service-ports dev
```
