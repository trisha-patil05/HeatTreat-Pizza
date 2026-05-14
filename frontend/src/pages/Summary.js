import React, { useEffect, useState } from 'react';
import './Summary.css';

function Summary() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('orderData'));
    setOrder(data);
  }, []);

  const calculatePrice = (size) => {
    const priceList = {
      Small: 200,
      Medium: 250,
      Large: 300,
    };
    return priceList[size] || 0;
  };

  const calculateGST = (price) => {
    return (price * 0.18).toFixed(2); // Assuming 18% GST
  };

  const totalPrice = (size) => {
    const pizzaPrice = calculatePrice(size);
    const gst = calculateGST(pizzaPrice);
    return (parseFloat(pizzaPrice) + parseFloat(gst)).toFixed(2);
  };

  const handleDownloadReceipt = () => {
    const orderDetails = `Pizza Details:
      Pizza Size: ${order.size}
      Toppings: ${order.toppings.join(', ')}
      Drink: ${order.drink}
      Total Price: ₹${totalPrice(order.size)}
      GST: ₹${calculateGST(calculatePrice(order.size))}
      
      Thank you for ordering with Pizza Palace!`;

    const element = document.createElement("a");
    const file = new Blob([orderDetails], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "receipt.txt";
    document.body.appendChild(element);
    element.click();
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div className="summary-container">
      <h2>Order Summary</h2>
      
      <div className="order-details">
        <p><strong>Pizza Size:</strong> {order.size}</p>
        <p><strong>Toppings:</strong> {order.toppings.join(', ')}</p>
        <p><strong>Drink:</strong> {order.drink}</p>
        <p><strong>GST (18%):</strong> ₹{calculateGST(calculatePrice(order.size))}</p>
        <p><strong>Total Price:</strong> ₹{totalPrice(order.size)}</p>
      </div>

      <button className="download-btn" onClick={handleDownloadReceipt}>
        Download Receipt
      </button>
    </div>
  );
}

export default Summary;
