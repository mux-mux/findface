# FindFace - :crystal_ball:AI-powered app to detect faces:ok_woman:in the image:mountain_bicyclist:

[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/JKJVd3C3dwe5WUYnKkCXP7/NjWK5SHCqQTknUovfYEBtz/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/JKJVd3C3dwe5WUYnKkCXP7/NjWK5SHCqQTknUovfYEBtz/tree/main)

## [Live Link](https://jsgo.pro/findface/) :link:

<br/>

<div align="center">
  <img src="https://jsgo.pro/media/gif/findface.gif" alt="FindFace Demo" width="100%" />
  <br>
</div>

## Features :sparkles:

- Register Personal Account ✅
- Change User Profile Data 👤
- Store User Session 💾
- Show Progress Badges 🏆
- Find faces in the image 🙆‍♀️
- Apply image Filters 🎨
- Download Image 📥
- Switch light/dark theme 🌗
- Easy configuration with Docker 🐳

## Folder structure :open_file_folder:

<div align="center">
  <img src="https://jsgo.pro/media/structure/findface_project_structure.png" alt="Findface Folder structure" width="100%" />
  <br>
</div>

## How To Use :closed_lock_with_key:

### 1️⃣ Sign Up, Install & Run Docker Desktop

Download, install and run Docker Desktop:  
🔗 [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2️⃣ Clone the Repository

Open a terminal or command prompt and run:

```sh
git clone git@github.com:mux-mux/findface.git
cd findface
```

### 3️⃣ Start Backend

This will set up PostgreSQL, Redis, and the Express server:

```sh
cd backend
npm install
docker-compose up --build
```

### 4️⃣ Start Frontend

This will Open the browser & listen to files changes<br/>
Open another terminal in the project root and run:

```sh
npm install
npm start
```

Your app should now be running!<br/>
On: 🔗 http://localhost:3000

### 🎯 Notes

Ensure Docker Desktop is running before executing docker-compose up.<br/>
If you encounter any issues, try running:

```sh
docker-compose down && docker-compose up --build
```
