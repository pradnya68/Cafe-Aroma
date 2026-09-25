# ☕ Café Aroma — Full-Stack MERN Application

A production-ready, full-stack **MERN** (MongoDB, Express, React, Node.js) web application inspired by [Café Aroma](https://premiumcafearoma.netlify.app/). Built with a high-end café aesthetic, rich typography (`Playfair Display` & `Inter`), warm earthy color palettes, smooth animations, dynamic menu filtering, interactive cart & checkout, full table reservation system, and a comprehensive admin management dashboard.

---

## 🌟 Key Features

### 1. 🎨 Visual Design & Experience
- **Aesthetic**: Deep espresso tones, warm caramel accents, satin gold highlights, and soft cream surfaces.
- **Hero Section**: Typographic layout with subtle parallax effects, floating coffee bean accents, and location markers.
- **Micro-Interactions**: Hover shines, counter animations, interactive cart drawer, toast notifications, and modal lightbox image viewer.
- **Fully Responsive**: Optimized across mobile screens, tablets, laptops, and ultra-wide desktops.

### 2. 🍽️ Menu & Ordering System
- **Real-Time Data**: Menu records are fetched dynamically from MongoDB through REST APIs.
- **Category Filtering**: Seamless switching across *All Menu*, *Coffee*, *Tea*, *Breakfast*, *Desserts*, and *Specials*.
- **Live Search**: Instant keyword search by dish name or ingredient description.
- **Interactive Cart**: Persistent cart (via local storage) with quantity increment/decrement, item removal, subtotal calculation, and slide-over cart drawer.
- **Order Placement**: Multi-service order checkout supporting **Dine-In** (with table selection), **Takeaway**, and **Delivery** with instant confirmation and generated Order ID.

### 3. 📅 Table Reservation System
- **Active Booking Engine**: Dedicated booking form collecting Full Name, Email, Phone, Date, Time slot, Guests count, and Special requests.
- **Form Validation**: Immediate client validation and Express server validation.
- **Status Tracking**: Bookings saved to MongoDB with admin tracking (Pending, Confirmed, Seated, Completed, Cancelled).

### 4. 🛡️ Authentication & Security
- **JWT Authentication**: Secure token-based session handling with Bearer authorization headers.
- **Password Hashing**: `bcryptjs` salted password encryption.
- **Role-Based Access Control**: Strict segregation between standard customers (`user`) and cafe administrators (`admin`).
- **One-Click Demo Credentials**: Built-in fast-fill buttons for testing both Administrator and Customer accounts without manual typing.

### 5. ⚡ Admin Control Dashboard (`/admin`)
- **Dashboard Metrics**: Real-time aggregated statistics (Total Revenue, Total Orders, Pending Orders, Table Bookings, Menu Items, Newsletter Subscribers, and Contact Inquiries).
- **Menu Management**: Create new menu items, edit existing records, delete items, and toggle stock availability in real time.
- **Order Management**: Real-time order fulfillment table with status workflow updates (`pending` → `confirmed` → `preparing` → `ready` → `completed` → `cancelled`).
- **Reservation Management**: Table of bookings with status modification and removal.
- **Inquiries & Circle Members**: Review visitor messages from the contact form and newsletter subscribers.
- **Testimonial Moderation**: Approve or hide guest reviews displayed on the public landing page.

---

## 📂 Project Architecture

```
d:/Cafe_Aroma/
├── client/                          # React Frontend (Vite)
│   ├── public/
│   │   └── assets/                  # High-res authentic images & favicon
│   ├── src/
│   │   ├── components/              # Modular UI components
│   │   │   ├── Navbar.jsx           # Responsive navigation with badge & mobile drawer
│   │   │   ├── Hero.jsx             # Hero section with brand typography & CTAs
│   │   │   ├── About.jsx            # Heritage & craft section
│   │   │   ├── StatsSection.jsx     # Animated counters
│   │   │   ├── MenuSection.jsx      # Dynamic menu grid
│   │   │   ├── MenuCard.jsx         # Product card with hover shine & add-to-order
│   │   │   ├── CategoryFilter.jsx   # Filter tabs
│   │   │   ├── SpecialSection.jsx   # Today's special pour showcase
│   │   │   ├── FeaturesSection.jsx  # Pillars of Café Aroma
│   │   │   ├── Gallery.jsx          # Asymmetric masonry photo showcase
│   │   │   ├── LightboxModal.jsx    # Fullscreen keyboard-accessible modal
│   │   │   ├── Testimonials.jsx     # Guest reviews carousel
│   │   │   ├── ReservationForm.jsx  # Table booking form
│   │   │   ├── ContactSection.jsx   # Location, opening hours, interactive map & contact form
│   │   │   ├── Footer.jsx           # Newsletter subscription & footer links
│   │   │   ├── CartDrawer.jsx       # Slide-over order drawer
│   │   │   ├── Toast.jsx            # Order notifications
│   │   │   ├── Loading.jsx          # Coffee cup loading indicator
│   │   │   └── ProtectedRoute.jsx   # Admin and auth route guard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # User authentication provider
│   │   │   └── CartContext.jsx      # Shopping cart provider
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Complete home landing page
│   │   │   ├── AboutPage.jsx        # Dedicated About page
│   │   │   ├── MenuPage.jsx         # Dedicated Menu & Search page
│   │   │   ├── GalleryPage.jsx      # Dedicated Gallery page
│   │   │   ├── SpecialtiesPage.jsx  # Dedicated Specialties page
│   │   │   ├── ContactPage.jsx      # Dedicated Contact page
│   │   │   ├── ReservationPage.jsx  # Dedicated Book a Table page
│   │   │   ├── OrderPage.jsx        # Dedicated Checkout page
│   │   │   ├── LoginPage.jsx        # Login page with demo fast-fill
│   │   │   ├── RegisterPage.jsx     # Account creation page
│   │   │   └── AdminDashboard.jsx   # Full admin management portal
│   │   ├── services/
│   │   │   └── api.js               # Axios API client with interceptors
│   │   ├── App.jsx                  # Main application routing
│   │   ├── index.css                # Café Aroma design system & Tailwind
│   │   └── main.jsx                 # Entrypoint
│   ├── index.html                   # HTML entry with Playfair & Inter fonts
│   ├── tailwind.config.js           # Café theme palette configuration
│   ├── vite.config.js               # Vite config with API proxy
│   └── package.json
│
├── server/                          # Node.js / Express Backend
│   ├── config/
│   │   └── db.js                    # Mongoose MongoDB connection
│   ├── models/
│   │   ├── User.js                  # User model with bcrypt pre-save hook
│   │   ├── MenuItem.js              # Menu items model
│   │   ├── Category.js              # Categories model
│   │   ├── Order.js                 # Orders model
│   │   ├── Reservation.js           # Table bookings model
│   │   ├── ContactMessage.js        # Contact messages model
│   │   ├── NewsletterSubscriber.js  # Newsletter subscriber model
│   │   └── Testimonial.js           # Guest reviews model
│   ├── controllers/
│   │   ├── authController.js        # Register, login, getMe
│   │   ├── menuController.js        # Menu CRUD
│   │   ├── categoryController.js    # Category CRUD
│   │   ├── orderController.js       # Order creation & fulfillment
│   │   ├── reservationController.js # Table bookings handling
│   │   ├── contactController.js     # Visitor inquiry handling
│   │   ├── newsletterController.js  # Email subscription
│   │   ├── testimonialController.js # Guest feedback moderation
│   │   └── adminController.js       # Aggregated metrics & stats
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reservationRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── newsletterRoutes.js
│   │   ├── testimonialRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verify & admin verification
│   │   └── errorMiddleware.js       # Centralized error handler
│   ├── services/
│   │   └── seedData.js              # Seed data constants
│   ├── seed.js                      # Database seeder script
│   ├── index.js                     # Express server entry point
│   ├── package.json
│   └── .env                         # Server environment variables
│
├── package.json                     # Root scripts runner
├── .gitignore
└── README.md
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Axios, Lucide React, Tailwind CSS |
| **Backend** | Node.js, Express.js, Mongoose, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS, Dotenv |
| **Database** | MongoDB (Local or MongoDB Atlas) |
| **Fonts** | *Playfair Display* (Serif), *Inter* (Sans-serif) via Google Fonts |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **MongoDB** running locally on port `27017` or a MongoDB Atlas URI

### 2. Environment Variables Setup

The server uses `server/.env`. A ready configuration is already in place:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cafe_aroma
JWT_SECRET=super_secret_cafe_aroma_jwt_key_2026_secure
NODE_ENV=development
```

*(For MongoDB Atlas, replace `MONGO_URI` with your connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/cafe_aroma`)*

### 3. Database Seeding

Populate the database with sample menu items, categories, initial orders, reservations, testimonials, and test accounts:

```bash
# From project root:
npm run seed
```

This generates:
- **Admin Account**: `admin@cafearoma.com` / `admin123`
- **Customer Account**: `customer@example.com` / `customer123`
- 5 Menu Categories (*Coffee*, *Tea*, *Breakfast*, *Desserts*, *Specials*)
- 11 Menu Items with prices and authentic images
- 4 Testimonials with 5-star ratings
- Initial sample reservations and orders

---

## 💻 Running the Application

Open two terminal windows (or run concurrently):

### Start Backend Server:
```bash
# Option A: From root directory
npm run server

# Option B: Inside server directory
cd server
npm start
# Server starts at: http://localhost:5000
```

### Start Frontend Client:
```bash
# Option A: From root directory
npm run client

# Option B: Inside client directory
cd client
npm run dev
# Client starts at: http://localhost:5173
```

Now open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 🔑 Demo Accounts

Use these accounts to test the application or click the **Admin Demo** / **Customer Demo** buttons on the `/login` page:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@cafearoma.com` | `admin123` | Full access to `/admin` dashboard, menu CRUD, order status, bookings, testimonials |
| **Customer** | `customer@example.com` | `customer123` | Place orders, reserve tables, view personal profile |

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & retrieve JWT |
| `GET` | `/api/auth/me` | Private | Retrieve current user profile |

### ☕ Menu Items (`/api/menu`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/menu` | Public | Get all menu items (filter by `category`, `search`) |
| `GET` | `/api/menu/:id` | Public | Get single menu item details |
| `POST` | `/api/menu` | Admin | Add new menu item |
| `PUT` | `/api/menu/:id` | Admin | Update menu item details / availability |
| `DELETE` | `/api/menu/:id` | Admin | Delete menu item |

### 📂 Categories (`/api/categories`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/categories` | Public | Get list of categories |
| `POST` | `/api/categories` | Admin | Create category |
| `PUT` | `/api/categories/:id` | Admin | Update category |
| `DELETE` | `/api/categories/:id` | Admin | Remove category |

### 🛍️ Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Public / User | Place an order (Dine-in, Takeaway, Delivery) |
| `GET` | `/api/orders` | User / Admin | Retrieve orders (admin views all; user views own) |
| `GET` | `/api/orders/:id` | Public / User | Get order details by ID |
| `PUT` | `/api/orders/:id/status` | Admin | Update status (`pending`, `preparing`, `ready`, etc.) |

### 📅 Table Reservations (`/api/reservations`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/reservations` | Public | Book a table |
| `GET` | `/api/reservations` | Admin | List all table bookings |
| `GET` | `/api/reservations/:id` | Admin | Get single reservation |
| `PUT` | `/api/reservations/:id/status` | Admin | Update booking status (`confirmed`, `seated`, etc.) |
| `DELETE` | `/api/reservations/:id` | Admin | Delete booking |

### ✉️ Contact & Inquiries (`/api/contact`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/contact` | Public | Submit visitor contact message |
| `GET` | `/api/contact` | Admin | View visitor messages |

### 📰 Newsletter (`/api/newsletter`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/newsletter` | Public | Subscribe email to the Aroma circle |
| `GET` | `/api/newsletter` | Admin | View subscriber list |

### ⭐ Testimonials (`/api/testimonials`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/testimonials` | Public | Get approved guest testimonials |
| `POST` | `/api/testimonials` | Public | Submit new guest testimonial |
| `PUT` | `/api/testimonials/:id/approve` | Admin | Toggle testimonial visibility |
| `DELETE` | `/api/testimonials/:id` | Admin | Delete testimonial |

### 📊 Admin Analytics (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin | Real-time totals for revenue, orders, bookings, items |

---

## 🌐 Production Deployment Guide

### Deploy Backend (e.g. Render / Railway / Heroku / AWS)
1. Push project code to GitHub.
2. Create a new Web Service pointing to the `server/` directory.
3. Configure environment variables in the cloud provider dashboard:
   - `NODE_ENV=production`
   - `PORT=5000` (or leave default assigned by provider)
   - `MONGO_URI=<your_mongodb_atlas_connection_string>`
   - `JWT_SECRET=<strong_random_secret_key>`
4. Build command: `npm install`
5. Start command: `npm start`
6. (Optional) Run `npm run seed` once to initialize the production database.

### Deploy Frontend (e.g. Vercel / Netlify)
1. In Vercel or Netlify, select the repository.
2. Root Directory: `client`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variable:
   - `VITE_API_URL=https://your-backend-service.onrender.com/api`
6. Deploy!
