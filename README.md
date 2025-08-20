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
