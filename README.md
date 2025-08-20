# Citizen Portal Backend Repo

This repository contains the **backend** part of the Citizen Portal App.

## Development Mode (Local)

### Prerequisites

- Node.js 20.x (LTS) or 22.x (Current)
- npm
- Docker (for MongoDB container)

### Run Locally

#### If this is your first time using the app

1. Create MongoDB container with initial database:

   ```bash
   npm run db:create
   ```

2. Seed the database with a default admin user:

   ```bash
   npm run admin:seed:ts
   ```

   - Default credentials: username: `admin` | password: `admin123!`
   - You can change these credentials later in the app.

3. Start backend server:

   ```bash
   npm run dev
   ```

4. Access backend at:

   ```
   http://localhost:5000
   ```

#### If you already have the database and users/data

1. Start existing MongoDB container:

   ```bash
   npm run db:run
   ```

2. Start backend server:

   ```bash
   npm run dev
   ```

3. Access backend at:

   ```
   http://localhost:5000
   ```

### Production Mode (Independent)

1. Setup Docker environment and run backend:

   ```bash
   npm run setup:docker
   npm run admin:seed:js
   ```

   - Default credentials: username: `admin` | password: `admin123!`
   - You can change these credentials later in the app.

2. Backend runs on its configured port (default 5000).
