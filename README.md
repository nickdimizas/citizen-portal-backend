# Project Title

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

This is a backend for a citizen portal application. It provides user authentication, administration, and basic citizen services. The project uses:

- **Node.js** and **Express** for the backend server
- **MongoDB** for the database
- **JWT** for authentication

The application allows citizens to register, log in, and administrators to manage user data securely.

---

### **Prerequisites**

- **Node.js**: Version 22+ recommended
- **Docker**: Required only if you want to use the provided local MongoDB setup.  
  If you plan to connect to your own MongoDB instance, Docker is not needed.

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
    - Copy `.env.example` to create your `.env` file.

    ```bash
    cp .env.example .env
    ```

    - Generate a `JWT_SECRET` and add it to your `.env` file:

    ```bash
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
    ```

    - The `MONGO_URI` in `.env.example` is pre-configured for the Docker setup with the correct credentials (`appuser:app_password`).  
      **Do not change these values unless you are connecting to your own MongoDB instance.**

4.  **Create and start the database:**
    - Run the Docker script to pull the MongoDB image, create a container, and initialize the database and user:

    ```bash
    npm run setup:db
    ```

5.  **Seed the default admin user:**
    - This script creates a default admin user with the following credentials:
      - **Username:** admin
      - **Password:** admin123!
    - Developers can log in with these credentials immediately and change the password afterward.

    ```bash
    npm run admin:seed:ts
    ```

    > ⚠️ After logging in, it is strongly recommended to change the default password.

---

#### **Option 2: Use Your Own MongoDB**

If you prefer to use an existing MongoDB instance, you can skip the Docker command and configure your `.env` file manually.

1.  **Follow steps 1-3 from Option 1.**

2.  **Update the `MONGO_URI`:**
    - In your `.env` file, replace the default `MONGO_URI` with your own connection string.

    **Note:** If you are using your own MongoDB instance, it must include:
    - An application user with `readWrite` access
    - A `users` collection containing at least one admin user.  
      Passwords are hashed by the backend using bcrypt (10 salt rounds); if creating an admin manually, ensure the password is hashed accordingly. All required fields and validation rules are defined in the `User` model/schema.

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

After completing one of the setup options, you can start the application for development:

```bash
npm run dev
```
