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

## API:

### POST: /api/auth/register

Register User

###### Example Input:

```json
{
    "email": "user@gmail.com",
    "password": "reallyStrongPassword"
}
```

###### Example Response:

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJpYXQiOjE2Nzc1MTg3NjEsImV4cCI6MTY3NzUxOTY2MX0.Aeno3wGpdvpFNTGxlASv4uTSeJzMIsP0DWraQNNmQRA",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJpYXQiOjE2Nzc1MTg3NjEsImV4cCI6MTY3ODEyMzU2MX0.RMyrIZrf7VEbTs1XhTFJw8Y1Rw-aESpapGlkKUszBJ4"
}
```

### POST: /api/auth/login

Login User

###### Example Input:

```json
{
    "email": "user@gmail.com",
    "password": "reallyStrongPassword"
}
```

###### Example Response:

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJpYXQiOjE2Nzc1MTkyNzMsImV4cCI6MTY3NzUyMDE3M30.un70EdaFQQeJiWfd-V8ylvxiV0T386pXaeDufTId74I",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJpYXQiOjE2Nzc1MTkyNzMsImV4cCI6MTY3ODEyNDA3M30.VmWa7LegUDENjaTxr5dMRPt9PlGzC21wQjZLLbRjqrk"
}
```

### GET: /api/auth/refresh

Refresh Tokens

###### Example Response:

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJpYXQiOjE2Nzc1MTkzODAsImV4cCI6MTY3NzUyMDI4MH0.j06OAqAzmdEqoc7H8S0C9clWshxUs_LmRHymkBbY1p8",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJpYXQiOjE2Nzc1MTkzODAsImV4cCI6MTY3ODEyNDE4MH0.r04eUVlWrMtpcrFMKGlfQ8-jGIUMNMMoPvutm4GBuwo"
}
```

### GET: /api/user

Get Current User

###### Example Response:

```json
{
    "id": 1,
    "email": "user@gmail.com",
    "createdAt": "2023-02-27",
    "refreshToken": "$argon2id$v=19$m=65536,t=3,p=4$hEgxVz2F4onNfdzUtLcUqA$H5U7k/TAQpaL2kKtlr175elslEtzXZDDkmW+MwCkvuI"
}
```

### PATCH: /api/user

Update Current User

###### Example Input:

```json
{
    "email": "wintersakura@gmail.com"
}
```

###### Example Response:

```json
{
    "id": 1,
    "email": "wintersakura@gmail.com",
    "createdAt": "2023-02-27",
    "refreshToken": "$argon2id$v=19$m=65536,t=3,p=4$hEgxVz2F4onNfdzUtLcUqA$H5U7k/TAQpaL2kKtlr175elslEtzXZDDkmW+MwCkvuI"
}
```

### POST: /api/bank

Create Bank

###### Example Input:

```json
{
    "name": "privat bank"
}
```

###### Example Response:

```json
{
    "name": "privat bank",
    "user": {
        "id": 1,
        "email": "wintersakura@gmail.com",
        "createdAt": "2023-02-27",
        "refreshToken": "$argon2id$v=19$m=65536,t=3,p=4$hEgxVz2F4onNfdzUtLcUqA$H5U7k/TAQpaL2kKtlr175elslEtzXZDDkmW+MwCkvuI"
    },
    "id": 1,
    "balance": 0,
    "createdAt": "2023-02-27"
}
```

### GET: /api/bank

Get All Banks

###### Example Response:

```json
[
    {
        "id": 1,
        "name": "privat bank",
        "balance": 0,
        "createdAt": "2023-02-27",
        "user": {
            "id": 1,
            "email": "wintersakura@gmail.com",
            "createdAt": "2023-02-27",
            "refreshToken": "$argon2id$v=19$m=65536,t=3,p=4$hEgxVz2F4onNfdzUtLcUqA$H5U7k/TAQpaL2kKtlr175elslEtzXZDDkmW+MwCkvuI"
        }
    }
]
```

### GET: /api/bank/:id

Get Bank By Id

###### Example Response:

```json
{
    "id": 1,
    "name": "privat bank",
    "balance": 0,
    "createdAt": "2023-02-27",
    "user": {
        "id": 1,
        "email": "wintersakura@gmail.com",
        "createdAt": "2023-02-27",
        "refreshToken": "$argon2id$v=19$m=65536,t=3,p=4$hEgxVz2F4onNfdzUtLcUqA$H5U7k/TAQpaL2kKtlr175elslEtzXZDDkmW+MwCkvuI"
    }
}
```

### PATCH: /api/bank/:id

Update Bank

###### Example Input:

```json
{
    "name": "privat updated bank"
}
```

###### Example Response:

```json
{
    "id": 1,
    "name": "privat updated bank",
    "balance": 0,
    "createdAt": "2023-02-27",
    "user": {
        "id": 1,
        "email": "wintersakura@gmail.com",
        "createdAt": "2023-02-27",
        "refreshToken": "$argon2id$v=19$m=65536,t=3,p=4$hEgxVz2F4onNfdzUtLcUqA$H5U7k/TAQpaL2kKtlr175elslEtzXZDDkmW+MwCkvuI"
    }
}
```

### POST: /api/bank/:id/statistics

Get Bank Statistics

###### Example Input:

```json
{
    "categoryIds": [
        1,
        2
    ],
    "fromPeriod": "2023/01/03",
    "toPeriod": "2023/02/28"
}
```

###### Example Response:

```json
[
    {
        "salary": 1000
    },
    {
        "food updated": -800
    }
]
```

### DELETE: /api/bank/:id

Delete Bank

### POST: /api/category

Create Category

###### Example Input:

```json
{
    "name": "food"
}
```

###### Example Response:

```json
{
    "name": "food",
    "user": {
        "id": 1,
        "email": "wintersakura@gmail.com",
        "createdAt": "2023-02-27",
        "refreshToken": "$argon2id$v=19$m=65536,t=3,p=4$hEgxVz2F4onNfdzUtLcUqA$H5U7k/TAQpaL2kKtlr175elslEtzXZDDkmW+MwCkvuI"
    },
    "id": 1,
    "createdAt": "2023-02-27"
}
```

### GET: /api/category

Get All Categories

###### Example Response:

```json
[
    {
        "id": 1,
        "name": "food",
        "createdAt": "2023-02-27"
    },
    {
        "id": 2,
        "name": "salary",
        "createdAt": "2023-02-27"
    }
]
```

### GET: /api/category/:id

Get Category By Id

###### Example Response:

```json
{
    "id": 1,
    "name": "food",
    "createdAt": "2023-02-27"
}
```

### PATCH: /api/category/:id

Update Category

###### Example Input:

```json
{
    "name": "food updated"
}
```

###### Example Response:

```json
{
    "id": 1,
    "name": "food updated",
    "createdAt": "2023-02-27"
}
```

### DELETE: /api/category/:id

Delete Category

### GET: /api/bank/:bankId/transaction

Get All Transactions

###### Example Response:

```json
[
    {
        "id": 1,
        "amount": 1000,
        "type": 1,
        "createdAt": "2023-02-27",
        "bank": {
            "id": 1,
            "name": "privat updated bank",
            "balance": 200,
            "createdAt": "2023-02-27"
        },
        "categories": [
            {
                "id": 2,
                "name": "salary",
                "createdAt": "2023-02-27"
            }
        ]
    },
    {
        "id": 2,
        "amount": 800,
        "type": 0,
        "createdAt": "2023-02-27",
        "bank": {
            "id": 1,
            "name": "privat updated bank",
            "balance": 200,
            "createdAt": "2023-02-27"
        },
        "categories": [
            {
                "id": 1,
                "name": "food updated",
                "createdAt": "2023-02-27"
            }
        ]
    }
]
```

### DELETE: /api/bank/:bankId/transaction/:transactionId

Delete Transaction

### POST: /api/webhook

Webhook (create transaction)

###### Example Input:

```json
{
    "amount": 800,
    "type": 0,
    "bankId": 1,
    "userId": 1,
    "categoryIds": [
        1
    ]
}
```

## Swagger Documentation

### Endpoint: /api/docs

## Stack

* Node.js
* NestJS
* TypeScript
* PostgreSQL
* Docker
* Type ORM
* Swagger API docs
* Jest

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file
<br/>
(You can also check them in .env.sample)

`POSTGRES_HOST`
`POSTGRES_HOST`
`POSTGRES_PORT`
`POSTGRES_USER`
`POSTGRES_PASSWORD`
`POSTGRES_DB`

`TARGET`

`API_PORT`
`JWT_ACCESS_SECRET`
`JWT_REFRESH_SECRET`