# 🛒 Lady MaYa's Groceries

A full-stack grocery e-commerce storefront built for **Lady MaYa's Groceries** — a UK-sourced grocery business serving both retail and bulk customers across Ghana and the UK.

---

## Live URLs

| Service | URL |
|---|---|
| Frontend | _https://ladymayas.vercel.app_ (update after deploy) |
| Backend API | _https://ladymayas-api.onrender.com_ (update after deploy) |
| API Docs | _https://ladymayas-api.onrender.com/docs_ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | FastAPI, Python 3.11 |
| Database | PostgreSQL (SQLAlchemy ORM) |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Image Storage | Cloudinary |
| Deployment | Vercel (frontend) + Render (backend + DB) |

---

## Project Structure

```
ladymayas-groceries/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # SQLAlchemy engine + session
│   ├── models.py            # Product + Admin DB models
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── auth_utils.py        # JWT creation + bcrypt + auth guard
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variable template
│   └── routers/
│       ├── auth.py          # Login + admin seed
│       ├── products.py      # Full product CRUD
│       └── upload.py        # Cloudinary image upload
│
└── frontend/
    └── src/
        ├── constants/
        │   └── brand.js         # Colors, alphabet, currency formatter
        ├── services/
        │   └── api.js           # All fetch calls to the backend
        ├── hooks/
        │   ├── useProducts.js   # Fetch + filter products
        │   ├── useAuth.js       # Login, logout, token state
        │   └── useToast.js      # Toast notification state
        ├── components/
        │   ├── Badge.jsx        # Reusable colored label
        │   ├── Toast.jsx        # Success/error notification
        │   ├── Navbar.jsx       # Top header with search
        │   ├── Sidebar.jsx      # Filters — category, A-Z, type
        │   ├── ProductCard.jsx  # Grid product card
        │   ├── ProductModal.jsx # Product detail + WhatsApp CTA
        │   └── ImageUploader.jsx# Drag/click image upload widget
        ├── pages/
        │   ├── StoreFront.jsx   # Public product listing page
        │   ├── AdminLogin.jsx   # Admin authentication page
        │   └── AdminPanel.jsx   # Product management dashboard
        ├── App.jsx              # View router (store/login/admin)
        └── main.jsx             # React entry point
```

---

## Features

### Public Storefront
- Product grid with real images or emoji fallback
- Live search by product name or category
- Sidebar filters — category, purchase type (retail/bulk), A–Z alphabet browser
- Active filter chips with one-click clear
- Product modal with description, price, and pre-filled WhatsApp order message
- Out-of-stock badge overlay
- Fully mobile responsive with hamburger sidebar

### Admin Panel
- JWT-protected login (token stored in localStorage)
- Dashboard stats — total, in stock, out of stock
- Full product table — edit, delete, toggle stock, toggle visibility
- Add/edit product form with Cloudinary image upload
- Category is free-text (auto-populates sidebar dynamically)
- Admin accessible from sidebar on mobile, navbar on desktop

---

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL running locally
- Cloudinary account (free tier)

---

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create environment file
cp .env.example .env
# Fill in your values (see Environment Variables section)

# 5. Create the PostgreSQL database
psql -U postgres -c "CREATE DATABASE ladymayas_db;"

# 6. Start the server (tables auto-created on startup)
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

```bash
# 7. Seed the admin account (run once only)
curl -X POST http://localhost:8000/auth/seed
# Default credentials: admin / maya2024
# Change this password after first login
```

---

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
echo "VITE_API_URL=http://localhost:8000" > .env.local

# 4. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Environment Variables

### Backend — `backend/.env`

```bash
# PostgreSQL connection string
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/ladymayas_db

# JWT signing secret — use a long random string in production
SECRET_KEY=replace-this-with-a-long-random-string

# Cloudinary — from your Cloudinary dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Cloudinary folder — organises uploads per project
CLOUDINARY_FOLDER=projects/ladymayas_groceries/products
```

### Frontend — `frontend/.env.local`

```bash
# Backend API base URL
VITE_API_URL=http://localhost:8000
```

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | List visible products (supports `?search=`, `?category=`, `?purchase_type=`) |
| GET | `/products/categories` | List distinct categories |
| GET | `/products/{id}` | Single product detail |

### Admin (JWT required)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Login — returns JWT token |
| POST | `/auth/seed` | Create first admin account (one-time) |
| GET | `/products/admin/all` | All products including hidden |
| POST | `/products` | Create product |
| PATCH | `/products/{id}` | Update product fields |
| DELETE | `/products/{id}` | Delete product |
| PATCH | `/products/{id}/toggle-stock` | Flip in_stock |
| PATCH | `/products/{id}/toggle-visibility` | Flip is_visible |
| POST | `/upload/image` | Upload image to Cloudinary |

---

## Deployment

### Backend → Render

1. Push `backend/` to GitHub
2. Render → **New Web Service** → connect repo
3. Set **Root Directory** to `backend`
4. **Build command:** `pip install -r requirements.txt`
5. **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add a **PostgreSQL** database on Render → copy the connection string
7. Add all environment variables from `backend/.env`
8. After deploy, call `POST https://your-api.onrender.com/auth/seed`

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Vercel → **New Project** → connect repo
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-api.onrender.com`
5. Deploy

### Update CORS after deploy

In `backend/main.py`, update `allow_origins`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-vercel-app.vercel.app",
    ],
    ...
)
```

---

## Cloudinary Folder Structure

Images are organised by project to keep your Cloudinary account clean:

```
your-cloudinary-account/
└── projects/
    └── ladymayas_groceries/
        └── products/
            ├── rice_25kg.jpg
            ├── milo_drink.jpg
            └── dano_milk.jpg
```

To use a different folder for a new project, just change `CLOUDINARY_FOLDER` in `.env`.

---

## Admin Usage Guide

1. Open the store → click **Admin** (navbar on desktop, bottom of sidebar on mobile)
2. Login with your credentials
3. **Add Product** — fill in name, price, category, upload image, set purchase type
4. **Edit** — update any field including swapping the image
5. **Toggle Stock** — mark items as out of stock without deleting them
6. **Toggle Visibility** — hide items from the storefront without deleting them
7. **Delete** — permanently removes the product

> Images upload directly to Cloudinary. The Cloudinary URL is saved to the database automatically.

---

## Contact

**Lady MaYa's Groceries**
- 📞 UK: +44 7442 847723
- 📞 Ghana: +233 2632 62569

---

## Developer

Built by [Asiedu Seth Osei](https://github.com/asieducodes)