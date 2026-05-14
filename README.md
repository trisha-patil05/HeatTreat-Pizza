![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![License](https://img.shields.io/badge/Status-Active-orange)

# 🍕 HeatTreat Pizza

HeatTreat Pizza is a full-stack web application that allows users to browse pizzas, customize their orders, manage a cart, and place orders seamlessly. It also includes an admin dashboard for managing inventory and orders.

Designed with a clean UI and modular architecture, the project demonstrates real-world full-stack development using React and Node.js.

***

## 🚀 Features

- 🏠 Landing page with modern UI
- 🍕 Pizza listing with images
- 🔍 Pizza details & customization
- 🛒 Shopping cart system
- 📦 Order placement & summary
- 🧾 GST and total price calculation
- 🔐 User authentication (Login system)
- 🧑‍💼 Admin dashboard
- 📊 Inventory management
- 📁 Clean and modular folder structure
- 📱 Responsive design

***

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Context API (Auth & Cart)
- CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose

### Other Tools
- JWT Authentication
- REST APIs

***

## 📂 Project Structure

```
react-pizza-app/
│
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── api/         # API calls
│       ├── components/  # Reusable components
│       ├── context/     # Global state
│       └── pages/       # App pages
│
└── package.json
```

***

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

Create a `.env` file inside `backend/` and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run the backend server:

```bash
node server.js
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

***

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT authentication |
| `PORT` | Backend server port (default: 5000) |

***

## 📸 Screenshots

> Add screenshots here (recommended):
> - Home Page
> - Pizza Details
> - Cart Page
> - Order Summary
> - Admin Dashboard

***

## 🚧 Future Enhancements

- 💳 Payment integration (Stripe / Razorpay)
- 📦 Order tracking system
- 📜 Order history
- ⭐ Ratings & reviews
- 🔔 Notifications system

***

## 🧠 Key Learning Outcomes

- Built a full-stack application using the MERN stack
- Implemented authentication using JWT
- Designed RESTful APIs
- Managed global state using Context API
- Structured scalable frontend and backend architecture

***

## 👩‍💻 Author
**Trisha Patil**  
GitHub: [github.com/trisha-patil05](https://github.com/trisha-patil05)  
LinkedIn: [linkedin.com/trisha-patil05](https://www.linkedin.com/in/trisha-patil05/)
***

## 🌟 Support

If you found this project helpful, consider giving it a ⭐ on [GitHub](https://github.com/trisha-patil05/HeatTreat-Pizza)!
