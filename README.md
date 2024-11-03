# Webscraper for www.freelance.de

## Description

This app scrapes the projects of www.freelance.de  

Starting from the start url:


the next Button is used until the end is reached.


Results are written to Docker Volume

## Configuration

create .env File at root level with values:

```sh
STARTURL=''
```

Path to Result file Data.json is defined in compose.yaml file

```sh
services:
  webscraping:
    build:
      context: . 
    env_file:
     - .env
    volumes:
    - ./:/usr/src/app/
    ports:
      - 3000:3000
```

## Run the App

```sh
docker compose up --build
```






