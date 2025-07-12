# Zelestra Web - Project Management for Renewable Energy

![Zelestra Logo](client/src/assets/images/zelestra.png)

## 🚀 How to Use It (Step-by-Step)

### 1. **Clone the Project**

```bash
git clone <repository-url>
cd Zelestra-web
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Add Environment Variables**

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/zelestra
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
NODE_ENV=development
```

### 4. **Set Up the Database**

```bash
npm run db:push
```

### 5. **Start the Development Server**

```bash
npm run dev
```

### 6. **Access the App**

* Web UI: [http://localhost:5001](http://localhost:5001)
* API: [http://localhost:5001/api](http://localhost:5001/api)

---

## 🔧 Tech Stack

### **Frontend**

* React + TypeScript + Vite
* Tailwind CSS
* Recharts, React Query, Wouter, Framer Motion

### **Backend**

* Node.js + Express + TypeScript
* Drizzle ORM + PostgreSQL
* JWT + Passport.js + bcrypt

### **Other Tools**

* ExcelJS (exports), Zod (validation), date-fns (date utils)
* ESLint, Prettier, Drizzle Kit

---

## 📁 Project Structure

```
Zelestra-web/
├── client/          # Frontend code
├── server/          # Backend code
├── shared/          # Shared types/schema
├── attached_assets/ # Docs & assets
└── config files     # tsconfig, tailwind, etc.
```

---

## 📡 APIs & DB

### 🔐 Auth

* `POST /api/auth/login` → Login with email & password
* `POST /api/auth/verify` → Verify token

### 📁 Projects

* `GET /api/projects` → List (with filters)
* `POST /api/projects` → Create
* `PUT /api/projects/:id` → Update
* `DELETE /api/projects/:id` → Delete

### 📊 Analytics

* `GET /api/stats` → Project stats
* `GET /api/charts` → Data for charts

### 📤 Export

* `GET /api/export/projects` → Export CSV
* `GET /api/export/projects/excel` → Export Excel

### 🗄️ DB Schema

* `users` table (auth, roles, etc.)
* `projects` table (energy\_type, capacity, status, etc.)

---

## 🧑‍💻 Dev & Deployment

### Run Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run start     # Run production server
npm run db:push   # Push DB schema
```

### Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 5001
CMD ["npm", "start"]
```

---

## 🤝 Contribution Guide

1. Fork this repo
2. Create a new branch for your feature/fix
3. Commit your changes clearly
4. Open a pull request

#### ✅ Example Commit Messages

```
feat: added project filter by location
fix: fixed session expiration bug
docs: updated API instructions
```

---

## 🪪 License

MIT License — [View License](LICENSE)

---

## 💬 Support

* Open an issue here on GitHub
* Or contact the dev team directly

---

**Made with 💚 by the Zelestra Team**
