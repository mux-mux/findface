# FindFace - :crystal_ball:AI powered App to Detect faces in the image:ok_woman:

## [Live Link](https://jsgo.pro/findface/) :link:

<br/>

<div align="center">
  <img src="https://jsgo.pro/media/gif/findface.gif" alt="FindFace Demo" width="100%" />
  <br>
</div>

## Stages :scroll:

1. React Components
2. Tailwind Forms, Classes
3. ClarifAI Face Area Detect
4. Switch Light/Dark Theme
5. Express Endpoints
6. PostresSQL DB
7. Knex JS DB Connect
8. Bcrypt Password Storage
9. Vercel Deployment

## Folder structure :open_file_folder:

<div align="center">
  <img src="https://jsgo.pro/media/structure/findface_project_structure.png" alt="Findface Folder structure" width="100%" />
  <br>
</div>

## How To Use :closed_lock_with_key:

### 1️⃣ Sign Up & Install Docker Desktop

Download and install Docker Desktop:  
🔗 [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2️⃣ Clone the Repository

Open a terminal or command prompt and run:

```sh
git clone git@github.com:mux-mux/findface.git
cd findface
```

### 3️⃣ Install Dependencies

Run the following command in the root directory:

```sh
npm install
```

### 4️⃣ Start Backend (Docker + Express)

Open a new terminal:

```sh
cd backend
npm install
```

🔹 Build and Start Docker Containers
This will set up PostgreSQL, Redis, and the Express server:

```sh
docker-compose up --build
```

🔹 Start the Express Server

```sh
PORT=3001 node server.js
```

### 5️⃣ Start Frontend

Open another terminal in the project root and run:

```sh
npm install
npm start
```

### 6️⃣ Open in Browser

Your app should now be running! Open:
🔗 http://localhost:3000

#### 🎯 Notes

Ensure Docker Desktop is running before executing docker-compose up.
If you encounter any issues, try running:

```sh
docker-compose down && docker-compose up --build
```

Happy coding! 🚀
