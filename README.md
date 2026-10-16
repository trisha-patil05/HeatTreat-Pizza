![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-red)
![Status](https://img.shields.io/badge/Status-Live-success)

# 🍕 HeatTreat Pizza

> A full-stack food ordering web application built with the MERN stack.

🌐 **Live Demo:** [https://heat-treat-pizza.vercel.app](https://heat-treat-pizza.vercel.app)
🔧 **Backend API:** [https://heattreat-backend.onrender.com](https://heattreat-backend.onrender.com)

---

## 📸 Preview

> Login → Browse 28 Pizzas → Customize → Cart → Order → Email Confirmation → Admin Dashboard

---

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based Login & Registration
- Role-based Access Control — Admin vs User
- Protected Routes — unauthorized users redirected to login
- Forgot Password with OTP via Email (Nodemailer)
- Logout clears cart automatically

### 🍕 Pizza & Cart
- 28 pizzas with search, filter (Veg/Non-Veg/Spicy) & sort by price
- Global Navbar search — find pizza from any page
- Shopping cart with quantity management
- Promo code support — `HEAT10` (10% off), `PIZZA20` (20% off)
- Build Your Own Pizza — custom size, crust, toppings, sauce, drink

### 📦 Order Management
- Order placement with GST (18%) calculation
- Order confirmation screen with Order ID
- Receipt download as `.txt` file
- WhatsApp share — order details share karo
- Order History — all past orders from MongoDB
- Order progress — Placed → Preparing → Out for Delivery → Delivered

### 📧 Email Notifications
- Order confirmation email — beautiful HTML template
- Status update email — auto-sent when admin updates order
- OTP email for password reset

### 🧑‍💼 Admin Dashboard
- 📊 Overview — Revenue, Orders, Users stats
- 🍕 Pizza Management — Add, Delete, Toggle availability
- 📦 Orders Tab — Real MongoDB orders, live status update
- 👥 Users Tab — All registered users from MongoDB

### 🎨 UI/UX
- Dark theme with orange accent throughout
- Page animations — fade + slide-up on every route
- Staggered pizza card animations
- Loading states on all buttons
- Custom 404 page with spinning pizza
- Responsive design — mobile friendly
- Global CSS — consistent design system

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router DOM |
| State | localStorage (no Redux needed) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| Email | Nodemailer (Gmail) |
| Hosting | Vercel (Frontend), Render (Backend) |

---

## 📂 Project Structure

```
react-pizza-app/
│
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema (username, email, role)
│   │   └── Order.js             # Order schema (cartItems, status, user ref)
│   ├── routes/
│   │   ├── auth.js              # Login, Register, Forgot Password, OTP
│   │   ├── orderRoutes.js       # Place order, fetch orders, analytics
│   │   └── profileRoutes.js     # Profile update, password change
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT token verify
│   ├── services/
│   │   └── emailService.js      # Nodemailer email templates
│   └── server.js                # Express app entry point
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx        # Global navbar with search + dropdown
        │   └── BannerCarousel.js # Hero banner slider
        ├── pages/
        │   ├── LandingPage.js    # Public landing page
        │   ├── Login.js          # Login, Register, Forgot Password
        │   ├── HomePage.js       # Pizza menu with filters
        │   ├── PizzaDetails.js   # Customize pizza
        │   ├── PizzaCart.js      # Build your own pizza
        │   ├── ShoppingCart.js   # Cart with promo codes
        │   ├── OrderPage.js      # Place order
        │   ├── Summary.js        # Receipt + WhatsApp share
        │   ├── OurStory.js       # About page
        │   ├── Contact.js        # Contact form
        │   └── AdminDashboard.js # Full admin panel
        └── global.css            # Complete design system
```

---

## ⚙️ Local Setup

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

Create `.env` in `backend/`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

```bash
node server.js
# ✅ MongoDB Connected
# ✅ Server running on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `PORT` | Backend server port (default: 5000) |
| `REACT_APP_API_URL` | Backend API URL for production |

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | [heat-treat-pizza.vercel.app](https://heat-treat-pizza.vercel.app) |
| Backend | Render | [heattreat-backend.onrender.com](https://heattreat-backend.onrender.com) |
| Database | MongoDB Atlas | Cloud hosted |

---

## 🔑 Admin Access

To make a user admin, update their role in MongoDB Atlas:
```
HeatTreatPizzaDB → users collection → Edit document → role: "admin"
```
Then logout and login again — ⚙️ Admin link will appear in Navbar.

**Promo Codes:**
- `HEAT10` → 10% discount
- `PIZZA20` → 20% discount

---

## 🚧 Future Enhancements

- 💳 Razorpay Payment Gateway
- 🔴 Real-time Order Tracking (Socket.io)
- ⭐ Ratings & Reviews
- 📱 PWA (Progressive Web App)
- 🔔 Push Notifications

---

## 🧠 Key Learnings

- Built production-ready full-stack app using MERN stack
- Implemented JWT authentication with role-based access control
- Integrated Nodemailer for transactional emails
- Built admin analytics dashboard
- Managed state using localStorage (no Redux)
- Implemented OTP-based forgot password flow
- Deployed backend on Render, frontend on Vercel

---

## 👩‍💻 Author

**Trisha Patil**
- GitHub: [github.com/trisha-patil05](https://github.com/trisha-patil05)
- LinkedIn: [linkedin.com/in/trisha-patil05](https://www.linkedin.com/in/trisha-patil05/)

---

## 🌟 Support

If you found this project helpful, give it a ⭐ on [GitHub](https://github.com/trisha-patil05/HeatTreat-Pizza)!
