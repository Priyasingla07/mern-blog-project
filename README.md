# Blog Website (Extended Version)
Full-stack blog website with:
- Node.js + Express backend
- MongoDB (Mongoose)
- JWT auth with bcrypt
- Image upload (local /uploads) using multer
- Posts with Likes & Comments
- Frontend: static HTML, CSS, vanilla JS (uses localStorage for JWT)

## Quick start (local)
1. Install Node.js (v14+).
2. Start MongoDB (or use Atlas) and set MONGO_URI in backend/.env.
3. Backend:
   ```bash
   cd backend
   cp .env.example .env
   # edit .env to set MONGO_URI and JWT_SECRET
   npm install
   npm run dev
   ```
4. Frontend:
   Serve the `frontend/` folder (or open index.html directly).
   For a simple static server: `npx http-server frontend -p 3000`
5. Open frontend in browser and test register/login/create posts.

## Notes
- Uploaded images are stored in backend/uploads. For production use cloud storage (Cloudinary, S3).
- This project is for educational use and not production hardened.
