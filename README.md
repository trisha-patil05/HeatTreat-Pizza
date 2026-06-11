![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-red)
![License](https://img.shields.io/badge/Status-Active-orange)

# 🍕 HeatTreat Pizza

HeatTreat Pizza is a production-ready full-stack web application that allows users to browse pizzas, customize orders, manage a cart, and place orders seamlessly. It includes a powerful admin dashboard with real-time analytics, email notifications, JWT authentication, and much more.

Designed with a clean dark UI and modular architecture, the project demonstrates real-world full-stack development using the MERN stack.

---

## 🚀 Features

### 👤 Authentication & Security
- JWT-based Login & Registration
- Protected Routes — unauthorized users redirected to login
- Role-based Access Control — Admin vs User
- Forgot Password with OTP via Email
- Logout clears cart automatically (security best practice)

### 🍕 Pizza & Cart
- Landing page with modern UI & banner carousel
- Pizza listing with search, filters & sort
- Global Navbar search — find pizza from any page
- Shopping cart with quantity management
- Promo code support (HEAT10, PIZZA20)
- Order placement with GST calculation

### 📋 Order Management
- Order confirmation with receipt download (.txt)
- WhatsApp share — order details share karo
- Order History — all past orders from MongoDB
- Order progress tracker — Placed → Preparing → Out for Delivery → Delivered

### 📧 Email Notifications
- Order confirmation email — beautiful HTML template
- Status update email — auto-sent when admin updates order
- OTP email for password reset

### 👤 User Profile
- Edit name, email, phone, address
- Change password with strength indicator
- Order statistics — total spent, orders count

### 🧑‍💼 Admin Dashboard
- Overview — Revenue, Orders, Users stats
- Analytics — Bar charts + Donut charts (pure CSS, no library)
  - Last 7 days orders & revenue
  - Order status breakdown
  - Payment method breakdown
  - Top selling pizzas
- Pizza Management — Add, Delete, Toggle availability
- Orders Tab — Real MongoDB orders, live status update
- Users Tab — All registered users from MongoDB

### 🎨 UI/UX
- Dark theme throughout
- Page animations — fade + slide-up on every route
- Staggered pizza card animations
- Toast notifications — success, error, info, warning
- Loading states on all buttons
- Custom 404 page with spinning pizza
- Responsive design

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Context API (Auth, Cart, Toast)
- CSS (custom dark theme, animations)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Nodemailer (email notifications)

### Other Tools
- JWT Authentication
- REST APIs
- Bcryptjs (password hashing)
- Render (backend hosting)
- Vercel (frontend hosting)

---

## 📂 Project Structure

```
react-pizza-app/
│
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verify
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Order.js            # Order schema
│   ├── routes/
│   │   ├── auth.js             # Login, Register, Forgot Password
│   │   ├── orderRoutes.js      # Orders CRUD + Analytics
│   │   └── profileRoutes.js    # Profile update
│   ├── services/
│   │   └── emailService.js     # Nodemailer email templates
│   └── server.js               # Entry point
│
├── frontend/
│   └── src/
│       ├── api/
│       │   └── client.js       # Axios instance
│       ├── components/
│       │   ├── Navbar.jsx       # Global search + dropdown
│       │   ├── ProtectedRoute.js
│       │   └── AdminRoute.js   # Admin-only access
│       ├── context/
│       │   ├── AuthContext.js  # Global auth state
│       │   ├── CartContext.js  # Cart management
│       │   └── ToastContext.js # Toast notifications
│       └── pages/
│           ├── HomePage.js      # Pizza listing
│           ├── AdminDashboard.js# Full admin panel
│           ├── OrderHistory.js  # Past orders
│           ├── ProfilePage.js   # User profile
│           ├── Summary.js       # Receipt + WhatsApp
│           ├── Login.js         # Auth + Forgot Password
│           └── NotFound.js      # 404 page
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/trisha-patil05/HeatTreat-Pizza.git
cd HeatTreat-Pizza
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run the backend:
```bash
node server.js
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

Create `.env` in `frontend/`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT |
| `PORT` | Backend port (default: 5000) |
| `REACT_APP_API_URL` | Backend API URL |

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend | Coming soon on Vercel |
| Backend | https://heattreat-backend.onrender.com |

---

## 📸 Screenshots

> Add screenshots here

---

## 🔑 Admin Access

To make a user admin, update their role in MongoDB Atlas:
```json
{ "role": "admin" }
```
Then logout and login again — ⚙️ Admin link will appear in Navbar.

---

## 🚧 Future Enhancements

- 💳 Razorpay Payment Gateway
- 🔴 Real-time Order Tracking (Socket.io)
- ⭐ Ratings & Reviews
- 📱 PWA (Progressive Web App)
- 🔔 Push Notifications

---

## 🧠 Key Learning Outcomes

- Built a production-ready full-stack app using MERN stack
- Implemented JWT authentication with role-based access control
- Designed RESTful APIs with proper error handling
- Integrated Nodemailer for transactional emails
- Built admin analytics dashboard with pure CSS charts
- Managed global state using React Context API
- Implemented real-world features: OTP, toast notifications, animations

---

## 👩‍💻 Author

**Trisha Patil**
GitHub: [github.com/trisha-patil05](https://github.com/trisha-patil05)
LinkedIn: [linkedin.com/in/trisha-patil05](https://www.linkedin.com/in/trisha-patil05/)

---

## 🌟 Support

If you found this project helpful, give it a ⭐ on [GitHub](https://github.com/trisha-patil05/HeatTreat-Pizza)!
