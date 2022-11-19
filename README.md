# Storefront Backend Project

## Table of Contents

* [Description](#Description)
* [Prerequisites](#Prerequisites)
* [Instructions](#Instructions)
* [Areas of Improvement](#Improvement)
* [References](#References)

## Description

a Udacity Typescript Project called Storefront Backend, covers the topic creating an API with PostgreSQL and Express.\
It features the use of **Typescript**, **Sequelize**, **PostgreSQL**, **Jasmine**, **Winston & Morgan**, **Joi**, and **Eslint**.

## Prerequisites
Your machine must have the following installed on it:
- [Node/NPM](https://nodejs.org/en/download/) (v16 or higher)


## Instructions
### 1. Clone the repository
```
git clone https://github.com/OMAR-777/storefront_backend.git
```

### 2. Install Dependencies
After Cloning the project, head inside the project folder and run
```
npm install
```

### Ports
the app runs on port 3000 and the database runs on port 5432.

### 3. Configuration
This is .env.example file provided in the repo of what .env file should look like.
```
# dev | test | prod
NODE_ENV=dev
NODE_PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=storefront_db
DB_TEST_NAME=storefront_test_db
DB_USERNAME=postgres
DB_PASSWORD=12345678
JWT_KEY=some_random_key
```

run the following command to create an .env file from .env.example.
```
cp .env.example .env
```

Replace environment variables with your credentials if needed.



### 4.  DB Creation and Migrations
Run the following script for creating the devolopment and testing databases specified in the .env file.
``` 
npm run create-dbs
```
or via PSQL:
```
CREATE DATABASE storefront_db;
CREATE DATABASE storefront_test_db;
```

after creation, run the following script to apply the migrations and add the required tables to the database.

``` 
npm run migrate:up
```

### 5. Starting the project
```
npm start
```

### 6. Running the tests
```
npm test
```

Any by now you should be able to go to `localhost:3000` to test that everything is working as expected.

## Areas of Improvement <a name="Improvement"></a>
- Adding Support for ORM/Query-Builder models.
- Adding Factories and Seeds for these models.


## References <a name="References"></a>
#### Boilerplate from my Session Lead <a href="https://github.com/Elshafeay/">Mohammed Elshafeay</a>:
- https://github.com/Elshafeay/ts-boilerplate
