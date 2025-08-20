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
   ```

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

1. Clone this repository and install dependencies:

   ```bash
   git clone <backend-repo-url>
   cd <backend-repo-folder>
   npm install
   ```

2. Start existing MongoDB container:

   ```bash
   npm run db:run
   ```

3. Start backend server:

   ```bash
   npm run dev
   ```

4. You can now access the backend at:
   ```
   http://localhost:5000
   ```

---

## Production Mode (Independent)

1. Clone this repository and install dependencies:

   ```bash
   git clone <backend-repo-url>
   cd <backend-repo-folder>
   npm install
   ```

2. Build the project:

   ```bash
   npm run build
   ```

3. Setup Docker environment, build and run backend:

   ```bash
   npm run setup:docker
   ```

4. Seed the database with a default admin user:

   ```bash
   npm run admin:seed:js
   ```

   - Default credentials: username: `admin` | password: `admin123!`
   - You can change these credentials later in the app.

5. You can now access the backend at:
   ```
   http://localhost:5000
   ```
