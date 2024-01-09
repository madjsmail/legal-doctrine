NestJS Server

A server built with NestJS with authentication, users, products, categories and purchases.
Installation

bash

Copy code
$ npm install

Running the app

bash

Copy code
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

Docker

bash

Copy code
# build image 
$ docker build -t nestjs-server .

# run container
$ docker run -p 3000:3000 nestjs-server

# Credit Cards

The app integrates with the Random Card API to generate random credit card data.

The /cards endpoint returns Visa cards with details except for the card number:

```
GET /cards

```
```
[
  {
    "type": "visa",
    "expiration": "2027-05-31",
    "name": "Juanita Schmidt" 
  },
  {
    "type": "visa", 
   "expiration": "2021-11-30",
    "name": "Timothy Smith"
  }
]
```
# for testing 
to make the routes public you can add this code after the @controller('..') 
```
@SetMetadata(AUTH_GUARD_CONFIG, {disabled: true}) 
```

# Modules

    Users: User accounts and authentication
    Products: Manage product catalog
    Categories: Categories for grouping products
    Purchases: Track user purchases

## Authentication

Authentication done via JSON Web Tokens. Protected routes use @AuthGuard()
Routes
Public

    POST /auth/login - Login with email/password
    GET /auth/decode/:token - Decode JWT token

Protected

## User Routes:

    POST /user - Register new user
    GET /user/:id - Get user by ID
    PATCH /user/:id - Update user
    DELETE /user/:id - Delete user

## Product Routes:

    POST /products - Create product
    GET /products/:id - Get product
    PATCH /products/:id - Update product
    DELETE /products/:id - Delete product

## Category Routes:

    GET /category/:id - Get category
    POST /category - Create category
    PATCH /category/:id - Update category
    DELETE /category/:id - Delete category


    GET /purchase/stats - Purchase statistics
    POST /purchase - Create purchase
    GET /purchase/:id - Get purchase
    PATCH /purchase/:id - Update purchase
    DELETE /purchase/:id - Delete purchase

Stay in touch