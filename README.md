# Zelestra Web - Project Management for Renewable Energy

![Zelestra Logo](client/src/assets/images/zelestra.png)

## 🚀 How to Use It (Step-by-Step)

### 1. **Clone the Project**

```bash
git clone https://github.com/gshrmafp/Zelestra-Energy-Dashboard.git
cd Zelestra-Energy-Dashboard
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Add Environment Variables**

Create a `.env` file:

```env
DATABASE_URL=mongoDb://user:pass@localhost:5432/zelestra
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
NODE_ENV=development
```

### 5. **Start the Development Server**

```bash
npm run dev
```

### 6. **Access the App**

* Web UI: [http://localhost:5001](http://localhost:5001)

---

## 🔧 Tech Stack

### **Frontend**

* React + TypeScript + Vite
* Tailwind CSS
* Recharts, React Query, Wouter, Framer Motion

### **Backend**

* Node.js + Express + TypeScript
* Drizzle ORM + MongoDB
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

## 💬 Support

* Open an issue here on GitHub
* Or contact the dev team directly

---

**Made with 💚 by the Gourav Sharma**
