# Transfer-io

Transfer-io is a Next.js project that includes a modern React front-end with built-in API endpoints and authentication utilities.

## Table of Contents

- [Overview](#overview)
- [Pages](#pages)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Additional Resources](#additional-resources)

## Overview

This project is built using Next.js and leverages the latest React features along with TypeScript for type safety. It uses [next-auth](https://next-auth.js.org/) for authentication and [Prisma](https://www.prisma.io/) as the ORM with a PostgreSQL database backend.

## Pages

The application pages are located in the `app` directory:

- **Dashboard Page:** [`src/app/(private)/page.tsx`](src/app/(private)/page.tsx) – Shows the balance and transactions
- **Deposit Page:** [`src/app/(private)/deposit/page.tsx`](src/app/(private)/deposit/page.tsx) – Allows users to deposit money
- **Transfer Page:** [`src/app/(private)/transfer/page.tsx`](src/app/(private)/transfer/page.tsx) – Allows users to transfer money

## API Endpoints

API endpoints are managed through Next.js's built-in routing capabilities. While the current structure uses Next.js’s file-based routing (check the [`middleware.ts`](src/middleware.ts) for request handling and authentication middleware):

###### **[POST] /app/api/users:** Creates a new user
```json
// Request body
{
  "name": "John Doe",
  "email": "johndoe@email.com",
  "password": "password123",
  "passwordConfirmation": "password123"
}
```
###### **[POST] /app/api/login** Authenticates a user
```json
// Request body
{
  "email": "johndoe@email.com",
  "password": "password123"
}
```
###### **[GET] /app/api/transactions:** Retrieves transactions
```json
// Headers
{
  "userId": "2b8e1f6c-4a2d-4f3b-9c5e-0a7d8e1f6c4b",
}
// Query parameters
{
  "page": 1,
  "pageSize": 10
}
```
###### **[GET] /app/api/transactions/balance:** Retrieves the user's balance
```json
// Headers
{
  "userId": "2b8e1f6c-4a2d-4f3b-9c5e-0a7d8e1f6c4b",
}
```
###### **[POST] /app/api/transactions/deposit:** Handles deposits
```json
// Headers
{
  "userId": "2b8e1f6c-4a2d-4f3b-9c5e-0a7d8e1f6c4b",
}
// Request body
{
  "amount": 10000 // Amount in cents
}
```
###### **[POST] /app/api/transactions/transfer:** Handles transfers
```json
// Headers
{
  "userId": "2b8e1f6c-4a2d-4f3b-9c5e-0a7d8e1f6c4b",
}
// Request body
{
  "to": "janedoe@email.com",
  "amount": 10000 // Amount in cents
}
```
###### **[POST] /app/api/transactions/:transactionId/cancel:** Cancels a transaction
```json
// Headers
{
  "userId": "2b8e1f6c-4a2d-4f3b-9c5e-0a7d8e1f6c4b",
}
// Request params
{
  "transactionId": "2b8e1f6c-4a2d-4f3b-9c5e-0a7d8e1f6c4b"
}
```

For authentication, the project uses [next-auth](https://next-auth.js.org/).

## Getting Started

To get the project running locally:

1. **Clone the repository:**

    ```sh
    git clone git@github.com:leandrolid/transfer-io.git
    cd transfer-io
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Set up environment variables:**

    - Copy the example file and fill in your settings:
      ```sh
      cp env.example .env
      ```
      
4. **Run database migrations and seeds (if applicable):**

    ```sh
    # Make sure you have PostgreSQL running and the database created
    # You can use Docker Compose to set up PostgreSQL
    # docker compose up -d
    npm run migrate:dev
    npm run seed:dev
    ```

5. **Start the development server:**

    ```sh
    npm run dev
    ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser** to see the application in action.

## Scripts

Key scripts defined in [package.json](http://_vscodecontentref_/1):

- **dev:** Starts the Next.js development server.
- **build:** Builds the application for production.
- **start:** Runs the production build.
- **lint:** Checks the project for linting errors.
- **migrate:dev:** Runs Prisma migrations in development.
- **seed:dev:** Seeds the database using Prisma.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)
- [Prisma Documentation](https://www.prisma.io/docs)
- [next-auth Documentation](https://next-auth.js.org/)