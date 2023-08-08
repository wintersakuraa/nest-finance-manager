# Finance Manager

## Description

Rest API for building web and mobile applications that helps keep track of the owner's finances.

## Installation

```bash
$ yarn
```

## Running the app

```bash
# with docker
$ yarn docker-compose:dev

# without docker
$ yarn start:dev
```

## Test

```bash
# unit tests
$ yarn test

# unit tests in watch mode
$ yarn test:watch

# test coverage
$ yarn test:cov
```

## Swagger Documentation

Endpoint: `/api/docs`

## Stack

-   Node.js
-   NestJS
-   TypeScript
-   PostgreSQL
-   Docker
-   TypeORM
-   Open API (Swagger)
-   Jest

## Environment Variables

Rename the sample environment variable file and add custom values to use environment variables in development:

```bash
mv .env.sample .env
```
