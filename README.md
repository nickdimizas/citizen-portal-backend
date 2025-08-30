# Project Title 🚀

A citizen portal application built with Node.js, Express, and MongoDB

---

### **Table of Contents**

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Option 1: Quick Start (Recommended)](#option-1-quick-start-recommended)
  - [Option 2: Use Your Own MongoDB](#option-2-use-your-own-mongodb)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)

---

### **Overview**

The **Citizen Portal Backend** is the service layer of a web application that allows citizens to securely access municipal services, personal information, and service requests. It is designed to provide a scalable, reliable, and secure API that connects the frontend interface with the database.

Key features include:

- **User authentication and authorization** using JWT.
- **Citizen profile management** for storing and updating user data.
- **Service request handling** to allow citizens to submit and track requests.
- **Notifications and communication** with the frontend.

The backend is built with **Node.js** and **Express.js** for handling API requests, **MongoDB** for flexible and scalable data storage, and **Docker** to simplify local development and deployment.

---

### **Prerequisites**

- **Node.js**: v22.x or higher.
- **Docker**: Required if you want to run MongoDB in a container for local development.

---

### **Getting Started**

#### **Option 1: Quick Start (Recommended)**

This method uses the provided Docker script to set up a local MongoDB instance with the required database and user. This is the simplest way to get the application running.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/nickdimizas/citizen-portal-backend.git
    cd citizen-portal-backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    - Copy the `.env.example` file to create your `.env` file. The `MONGO_URI` is pre-configured to work with the Docker setup.

    ```bash
    cp .env.example .env
    ```

    - The `MONGO_URI` in `.env.example` is already pre-configured with the correct credentials (`appuser:app_password`) for the Docker setup.  
      **Do not change these values unless you are connecting to your own MongoDB instance.**

    - You will need to generate a `JWT_SECRET` and add it to your new `.env` file. You can use the following command to generate a secure secret:

    ```bash
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
    ```

4.  **Create and start the database:**
    - Run the Docker script to pull the MongoDB image, create a container, and run the `mongo-init.js` script to set up a non-root user and seed the database.
    ```bash
    npm run db:create
    ```

#### **Option 2: Use Your Own MongoDB**

If you prefer to use an existing MongoDB instance, you can skip the Docker command and configure your `.env` file manually.

1.  **Follow steps 1-3 from Option 1.**

2.  **Update the `MONGO_URI`:**
    - In your `.env` file, replace the default `MONGO_URI` with your own connection string.

    **Note:** If you are using your own MongoDB instance, it must include:
    - An application user with `readWrite` access.
    - A `users` collection (required for authentication).

---

### **Environment Variables**

This section lists the environment variables required to run the application.  
Copy `.env.example` to `.env` and update the values where necessary.

| Variable Name    | Description                                                                                                                                 | Example                                                                                                                     |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------- |
| `MONGO_URI`      | MongoDB connection string. Preconfigured for the Docker setup with `appuser:app_password`. Replace only if using your own MongoDB instance. | `mongodb://appuser:app_password@localhost:27017/citizen_portal_db?authMechanism=SCRAM-SHA-256&authSource=citizen_portal_db` |
| `JWT_SECRET`     | Secret key for signing JWT tokens. Must be a long, random string.                                                                           | `your_long_secure_secret`                                                                                                   |
| `JWT_EXPIRES_IN` | Duration until JWT tokens expire.                                                                                                           | 1h                                                                                                                          |
| `PORT`           | Port the backend server will listen on. Optional — defaults to `5000`.                                                                      |                                                                                                                             |

---

### **Running the Application**

After completing one of the setup options, you can start the application:

````bash
npm run dev










# Citizen Portal Backend Repo

This repository contains the **backend** part of the Citizen Portal App.

## Development Mode (Local)

### Prerequisites

- Node.js 20.x (LTS) or 22.x (Current)
- npm
- Docker (for MongoDB container)

### Run Locally

#### If this is your first time using the app

1. Clone this repository and install dependencies:

   ```bash
   git clone <backend-repo-url>
   cd <backend-repo-folder>
   npm install
````

2. Create MongoDB container with initial database:

   ```bash
   npm run db:create
   ```

3. Seed the database with a default admin user:

   ```bash
   npm run admin:seed:ts
   ```

   - Default credentials: username: `admin` | password: `admin123!`
   - You can change these credentials later in the app.

4. Start backend server:

   ```bash
   npm run dev
   ```

5. You can now access the backend at:
   ```
   http://localhost:5000
   ```

---

#### If you already have the database and users/data

If you have already created the database in the first steps and you want to reuse the existing Docker volume (with all your current data), you can simply start the MongoDB container without creating a new volume:

1. Clone this repository and install dependencies:

   ```bash
   git clone <backend-repo-url>
   cd <backend-repo-folder>
   npm install
   ```

2. Start the existing MongoDB container:

   ```bash
   npm run db:run
   ```

   > This command will **reuse the existing MongoDB volume**.  
   > No new database or volume will be created.

3. Start backend server:

   ```bash
   npm run dev
   ```

4. You can now access the backend at:
   ```
   http://localhost:5000
   ```
