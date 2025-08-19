# ShopHub 🛍️

A modern e-commerce platform with:

✅ **React + Vite** frontend 
✅ **ASP.NET Core** backend 
✅ **Azure SQL Database** (Free tier for 30 months)  

---

## 🧰 Tech Stack

### Frontend

| Technology       | Use Case                |
|------------------|-------------------------|
| React 18         | UI Components           |
| Vite 4           | Build Tool              |
| Axios            | API Requests            |
| TailwindCSS      | Styling (Optional)      |

### Backend

| Technology       | Use Case                |
|------------------|-------------------------|
| ASP.NET Core 7   | REST API                |
| Entity Framework | Database ORM            |
| Azure SQL        | Database                |
| JWT              | Authentication          |

---

## 🛠️ Setup Guide

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [.NET 7 SDK](https://dotnet.microsoft.com/)
- [Azure Account](https://azure.microsoft.com/) (For Azure SQL)
- [Git](https://git-scm.com/)

---

## 📂 Project Structure

### Backend (`/Ecommerce(TrendFit.Api)`)

```
.
├── Controllers/       # API endpoints
├── Models/            # Database models
├── Migrations/        # EF Core migrations
├── appsettings.json   # Configuration
├── Program.cs         # Startup
└── Ecommerce(TrendFit.API).csproj # Project file
```

### Frontend (`/Trendfit-frontend`)

```
.
├── src/
│   ├── assets/        # Static files
│   ├── components/    # React components
│   ├── pages/         # Page routes
│   ├── App.jsx        # Main app
│   └── main.jsx       # Entry point
├── vite.config.js     # Build config
└── package.json       # Dependencies
```

---

## 🖥️ Local Development

### Backend Setup

Clone the repository:

```bash
git clone https://github.com/Yonas-40/Ecommerce(TrendFit.Api).git
cd shophub-backend
```

Configure database (`appsettings.json`):

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ShopHub;Trusted_Connection=True;"
}
```

Run migrations:

```bash
dotnet ef database update
```

Start the server:

```bash
dotnet run
```

API will run at `http://localhost:5001`

### Frontend Setup

Clone the repository:

```bash
git clone https://github.com/Yonas-40/Trendfit-frontend.git
cd shophub-frontend
```

Install dependencies:

```bash
npm install
```

Configure environment:

Create `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:5001
```

Start the app:

```bash
npm run dev
```

App will run at `http://localhost:5173`

---

## 🔐 Environment Variables (Optional)

### Backend

| Variable                         | Required | Description                   |
|----------------------------------|----------|-------------------------------|
| ConnectionStrings__DefaultConnection | Yes      | Azure SQL connection string   |
| JWT__Secret                      | Yes      | JWT signing key               |

### Frontend

| Variable         | Required | Description         |
|------------------|----------|---------------------|
| VITE_API_BASE_URL| Yes      | Backend API URL     |

---

## 📄 API Documentation

### Authentication

| Endpoint          | Method | Body                    | Description     |
|------------------|--------|-------------------------|-----------------|
| /api/auth/login   | POST   | { email, password }     | User login      |
| /api/auth/register| POST   | { name, email, password}| User registration|

### Products

| Endpoint          | Method | Description             |
|------------------|--------|-------------------------|
| /api/products     | GET    | Get all products        |
| /api/products/{id}| GET    | Get single product      |

---


