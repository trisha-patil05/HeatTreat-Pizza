<div align="center">

<img src="https://img.shields.io/badge/Stack-MERN-00D4FF?style=for-the-badge&labelColor=0D1117" />
<img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge&labelColor=0D1117" />
<img src="https://img.shields.io/badge/Email-Nodemailer-red?style=for-the-badge&labelColor=0D1117" />
<img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge&labelColor=0D1117" />
<img src="https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel&labelColor=0D1117" />
<img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&labelColor=0D1117" />

<br/><br/>

# 🍕 HeatTreat Pizza

### Production-ready full-stack food ordering app — built with MERN stack

*JWT auth · Role-based access · Admin analytics · Email notifications · Real order management*

<br/>

<!-- Replace # with your actual live link when deployed -->
<a href="#">
  <img src="https://img.shields.io/badge/🌐 Live Demo-Visit Site-00D4FF?style=for-the-badge&labelColor=0D1117" />
</a>
&nbsp;
<a href="https://heattreat-backend.onrender.com">
  <img src="https://img.shields.io/badge/⚙️ Backend API-Render-46E3B7?style=for-the-badge&labelColor=0D1117" />
</a>
&nbsp;
<a href="https://github.com/trisha-patil05/HeatTreat-Pizza">
  <img src="https://img.shields.io/badge/GitHub-Source Code-181717?logo=github&style=for-the-badge" />
</a>

</div>

---

## 📌 Overview

HeatTreat Pizza is a production-ready full-stack web application — not a tutorial clone. It allows users to browse pizzas, customize orders, manage a cart, and place orders. The admin side includes a full analytics dashboard with real-time charts, order management, and email notifications.

Built with a clean dark UI and modular architecture, the project covers real-world MERN development end-to-end — from JWT authentication to transactional emails to admin analytics.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based Login & Registration with protected routes
- Role-based Access Control — Admin vs User
- Forgot Password with OTP via Email (Nodemailer)
- Auto cart-clear on logout (security best practice)
- Admin access gated by role field in MongoDB

### 🍕 Pizza & Cart
- Landing page with banner carousel and modern dark UI
- Pizza listing with **search, filters & sort**
- Global Navbar search — accessible from any page
- Cart with quantity management
- **Promo code support** (`HEAT10`, `PIZZA20`)
- Order placement with GST calculation

### 📋 Order Management
- Order confirmation with **receipt download (.txt)**
- **WhatsApp share** — send order details directly
- Order History — fetched from real MongoDB data
- **Order progress tracker** — Placed → Preparing → Out for Delivery → Delivered

### 📧 Email Notifications
- Beautiful HTML order confirmation email on every purchase
- Auto status-update email when admin changes order state
- OTP email for password reset flow

### 👤 User Profile
- Edit name, email, phone, address
- Change password with strength indicator
- Order stats — total amount spent, order count

### 🧑‍💼 Admin Dashboard
- **Overview cards** — Revenue, Total Orders, Registered Users
- **Analytics** (pure CSS charts — no chart library dependency):
  - Last 7 days orders & revenue (bar chart)
  - Order status breakdown (donut chart)
  - Payment method breakdown
  - Top selling pizzas
- **Pizza Management** — Add, Delete, Toggle availability
- **Orders Tab** — Live MongoDB orders with real-time status update
- **Users Tab** — All registered users

### 🎨 UI/UX
- Dark theme throughout
- Page animations — fade + slide-up on every route
- Staggered pizza card animations
- Toast notifications — success, error, info, warning
- Loading states on all async actions
- Custom 404 page with spinning pizza animation
- Fully responsive design

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js · React Router DOM · Context API · Custom CSS |
| **Backend** | Node.js · Express.js |
| **Database** | MongoDB · Mongoose |
| **Auth** | JWT · Bcryptjs |
| **Email** | Nodemailer |
| **Hosting** | Vercel (frontend) · Render (backend) |

---

## 📂 Project Structure

```
HeatTreat-Pizza/
│
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Order.js              # Order schema
│   ├── routes/
│   │   ├── auth.js               # Login, Register, Forgot Password
│   │   ├── orderRoutes.js        # Orders CRUD + Analytics
│   │   └── profileRoutes.js      # Profile update
│   ├── services/
│   │   └── emailService.js       # Nodemailer email templates
│   └── server.js                 # Entry point
│
└── frontend/src/
    ├── api/
    │   └── client.js             # Axios instance with base URL
    ├── components/
    │   ├── Navbar.jsx            # Global search + user dropdown
    │   ├── ProtectedRoute.js     # Auth guard
    │   └── AdminRoute.js         # Admin-only route guard
    ├── context/
    │   ├── AuthContext.js        # Global auth state
    │   ├── CartContext.js        # Cart management
    │   └── ToastContext.js       # Toast notifications
    └── pages/
        ├── HomePage.js           # Pizza listing + filters
        ├── AdminDashboard.js     # Full admin panel
        ├── OrderHistory.js       # Past orders
        ├── ProfilePage.js        # User profile + stats
        ├── Summary.js            # Receipt + WhatsApp share
        ├── Login.js              # Auth + Forgot Password
        └── NotFound.js           # Custom 404 page
```

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/trisha-patil05/HeatTreat-Pizza.git
cd HeatTreat-Pizza
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start the backend:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Create `.env` inside `frontend/`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `PORT` | Backend server port (default: 5000) |
| `EMAIL_USER` | Gmail address for Nodemailer |
| `EMAIL_PASS` | Gmail App Password (not your actual password) |
| `REACT_APP_API_URL` | Backend API base URL |

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend | Coming soon on Vercel |
| Backend API | [heattreat-backend.onrender.com](https://heattreat-backend.onrender.com) |

---

## 🔑 Admin Access

To grant admin access, update the user's role in MongoDB Atlas:
```json
{ "role": "admin" }
```
Logout and log back in — the **⚙️ Admin** link will appear in the Navbar automatically.

---

## 📸 Screenshots

### 🏠 Home & Pizza Listing
| Landing Page | Pizza Listing & Filters |
|---|---|
| ![Home](./screenshots/home.png) | ![Pizza Listing](./screenshots/pizza-listing.png) |

### 🛒 Cart & Order Flow
| Cart Page | Order Summary & Receipt |
|---|---|
| ![Cart](./screenshots/cart.png) | ![Order Summary](./screenshots/order-summary.png) |

### 👤 User Pages
| Login / Register | User Profile |
|---|---|
| ![Login](./screenshots/login.png) | ![Profile](./screenshots/profile.png) |

### 🧑‍💼 Admin Dashboard
| Overview & Analytics | Order Management |
|---|---|
| ![Admin Overview](./screenshots/admin-overview.png) | ![Admin Orders](./screenshots/admin-orders.png) |

| Pizza Management | Users Tab |
|---|---|
| ![Admin Pizzas](./screenshots/admin-pizzas.png) | ![Admin Users](./screenshots/admin-users.png) |

### 📱 Responsive (Mobile View)
| Mobile Home | Mobile Cart |
|---|---|
| ![Mobile Home](./screenshots/mobile-home.png) | ![Mobile Cart](./screenshots/mobile-cart.png) |

> 📁 **How to add screenshots:**  
> 1. Create a `screenshots/` folder in the root of your repo  
> 2. Take screenshots and save them with the filenames shown above  
> 3. Push to GitHub — images will auto-appear here

---

## 🚧 Upcoming Features

- 💳 Razorpay Payment Gateway integration
- 🔴 Real-time Order Tracking via Socket.io
- ⭐ Pizza Ratings & Reviews
- 📱 Progressive Web App (PWA) support
- 🔔 Push Notifications

---

## 🧠 What I Built & Learned

- End-to-end MERN app with real deployment (Vercel + Render)
- JWT authentication with role-based access control from scratch
- RESTful API design with proper error handling and middleware
- Nodemailer integration for transactional emails (OTP, order confirmation, status updates)
- Admin analytics dashboard built with **pure CSS charts** — no chart library used
- Global state management using React Context API (Auth, Cart, Toast)
- Real-world UX patterns: OTP reset, loading states, toast system, page animations

---

## 👩‍💻 Author

**Trisha Patil** — B.Tech IT 2027, Gujarat

<a href="https://github.com/trisha-patil05">
  <img src="https://img.shields.io/badge/GitHub-trisha--patil05-181717?logo=github&style=for-the-badge" />
</a>
&nbsp;
<a href="https://www.linkedin.com/in/trisha-patil-629ab3300">
  <img src="https://img.shields.io/badge/LinkedIn-Trisha Patil-0A66C2?logo=linkedin&style=for-the-badge" />
</a>

---

<div align="center">
  <i>If this project helped you or you liked what you saw — drop a ⭐ on GitHub, it means a lot!</i>
</div>
