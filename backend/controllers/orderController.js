import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  const { cartItems, address } = req.body;

  if (!cartItems?.length || !address) {
    return res.status(400).json({ message: "Cart items and address required" });
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    user: req.user._id, // from auth middleware
    cartItems, // directly from your CartContext
    totalAmount,
    address
  });

  res.status(201).json(order);
};
