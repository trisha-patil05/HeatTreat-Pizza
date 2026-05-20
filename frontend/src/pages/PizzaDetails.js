import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const toppingsOptions = ['Olives', 'Onions', 'Peppers', 'Mushrooms', 'Jalapeños', 'Pineapple', 'Bacon', 'Cheese'];
const sizes   = ['Small', 'Medium', 'Large', 'Extra Large'];
const crusts  = ['Thin Crust', 'Thick Crust', 'Stuffed Crust'];
const sauces  = ['Tomato Sauce', 'Pesto Sauce', 'BBQ Sauce', 'Garlic Sauce'];
const drinks  = ['Coke', 'Pepsi', 'Sprite', 'Lemonade', 'Iced Tea'];

const sizePriceMap = { Small: 0, Medium: 50, Large: 100, 'Extra Large': 150 };
const basePrice    = 300;
const toppingPrice = 20;

const galleryImages = [
  '/pizzas/1.jpeg',
  '/pizzas/5.jpeg',
  '/pizzas/7.jpeg',
  '/pizzas/10.jpeg',
];

// ── Star Rating Input ──
function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-input">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`star-btn ${star <= (hovered || value) ? 'filled' : ''}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >★</span>
      ))}
    </div>
  );
}

// ── Star Display ──
function StarDisplay({ rating }) {
  return (
    <div className="star-display">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={`star ${star <= Math.round(rating) ? 'filled' : ''}`}>★</span>
      ))}
    </div>
  );
}

function PizzaDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { addToCart } = useCart();
  const { user }   = useAuth();

  const [toppings, setToppings]         = useState([]);
  const [size, setSize]                 = useState('Medium');
  const [crust, setCrust]               = useState('Thin Crust');
  const [sauce, setSauce]               = useState('Tomato Sauce');
  const [drink, setDrink]               = useState('Coke');
  const [selectedImage, setSelectedImage] = useState(0);
  const [priceFlash, setPriceFlash]     = useState(false);
  const [toast, setToast]               = useState('');

  // Reviews state
  const [reviews, setReviews]           = useState([]);
  const [newRating, setNewRating]       = useState(0);
  const [newComment, setNewComment]     = useState('');
  const [reviewError, setReviewError]   = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const totalPrice = basePrice + sizePriceMap[size] + toppings.length * toppingPrice;

  // Load reviews from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`reviews_${id}`) || '[]');
    setReviews(saved);
  }, [id]);

  useEffect(() => {
    setPriceFlash(true);
    const t = setTimeout(() => setPriceFlash(false), 400);
    return () => clearTimeout(t);
  }, [totalPrice]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const toggleTopping = (t) =>
    setToppings(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleAddToCart = () => {
    addToCart({ id, name: `Pizza #${id}`, price: totalPrice, image: galleryImages[selectedImage], toppings, size, crust, sauce, drink });
    showToast('🍕 Pizza added to cart!');
    setTimeout(() => navigate('/cart'), 1500);
  };

  const handleOrder = () => {
    localStorage.setItem('orderData', JSON.stringify({ pizzaId: id, toppings, size, crust, sauce, drink, totalPrice }));
    navigate('/summary');
  };

  // Submit review
  const handleSubmitReview = () => {
    if (newRating === 0) { setReviewError('⭐ Please select a rating'); return; }
    if (!newComment.trim()) { setReviewError('💬 Please write a comment'); return; }

    const review = {
      user: user?.name || user?.username || 'Anonymous',
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    const updated = [review, ...reviews];
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));
    setReviews(updated);
    setNewRating(0);
    setNewComment('');
    setReviewError('');
    setShowReviewForm(false);
    showToast('✅ Review submitted!');
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="details-page">
      {toast && <div className="toast">{toast}</div>}

      <div className="details-container">
        <h2 className="page-title">Customize Your Pizza #{id}</h2>
        <p className="page-subtitle">Choose your size, crust, toppings, sauce, and drink.</p>

        {/* 2 Column Layout */}
        <div className="details-two-col">

          {/* LEFT — Image + Price */}
          <div className="details-left">
            <img src={galleryImages[selectedImage]} alt={`Pizza ${id}`} className="pizza-preview-image" />
            <div className="gallery-thumbnails">
              {galleryImages.map((img, i) => (
                <img key={i} src={img} alt={`view ${i + 1}`}
                  className={`gallery-thumb ${selectedImage === i ? 'active-thumb' : ''}`}
                  onClick={() => setSelectedImage(i)}
                />
              ))}
            </div>

            {/* Average Rating */}
            {avgRating && (
              <div className="details-avg-rating">
                <StarDisplay rating={avgRating} />
                <span>{avgRating} / 5 &nbsp;({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}

            <div className={`price-box ${priceFlash ? 'price-flash' : ''}`} style={{ marginTop: '20px' }}>
              <p>Base Price: ₹{basePrice}</p>
              <p>Size Charge: ₹{sizePriceMap[size]}</p>
              <p>Toppings ({toppings.length}): ₹{toppings.length * toppingPrice}</p>
              <h3>Total: ₹{totalPrice}</h3>
            </div>

            <div className="details-btn-row" style={{ marginTop: '16px' }}>
              <button className="btn-primary" onClick={handleAddToCart}>Add to Cart</button>
              <button className="btn-outline" onClick={handleOrder}>Place Order</button>
            </div>
          </div>

          {/* RIGHT — Options */}
          <div className="details-right">
            <div className="input-group">
              <label className="input-label">Size</label>
              <select className="input-field" value={size} onChange={(e) => setSize(e.target.value)}>
                {sizes.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Crust</label>
              <select className="input-field" value={crust} onChange={(e) => setCrust(e.target.value)}>
                {crusts.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Sauce</label>
              <select className="input-field" value={sauce} onChange={(e) => setSauce(e.target.value)}>
                {sauces.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Drink</label>
              <select className="input-field" value={drink} onChange={(e) => setDrink(e.target.value)}>
                {drinks.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Toppings</label>
              <div className="toppings-grid">
                {toppingsOptions.map(top => (
                  <label key={top} className="topping-item">
                    <input type="checkbox" checked={toppings.includes(top)} onChange={() => toggleTopping(top)} />
                    {top}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── REVIEWS SECTION ── */}
        <div className="reviews-section">
          <div className="reviews-header">
            <h3 className="reviews-title">
              ⭐ Reviews {avgRating && <span className="avg-badge">{avgRating}/5</span>}
            </h3>
            <button
              className="btn-outline"
              style={{ fontSize: '13px', padding: '8px 16px' }}
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? '✕ Cancel' : '+ Write Review'}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="review-form">
              <p className="input-label">Your Rating</p>
              <StarInput value={newRating} onChange={setNewRating} />

              <div className="input-group" style={{ marginTop: '14px' }}>
                <label className="input-label">Your Review</label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Share your experience..."
                  value={newComment}
                  onChange={(e) => { setNewComment(e.target.value); setReviewError(''); }}
                />
              </div>

              {reviewError && <p className="field-error">{reviewError}</p>}

              <button className="btn-primary" style={{ marginTop: '12px' }} onClick={handleSubmitReview}>
                Submit Review
              </button>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to review! 🍕</p>
            </div>
          ) : (
            <div className="reviews-list">
              {reviews.map((review, i) => (
                <div key={i} className="review-card">
                  <div className="review-card-header">
                    <div className="reviewer-avatar">
                      {review.user[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="reviewer-name">{review.user}</p>
                      <p className="review-date">{review.date}</p>
                    </div>
                    <StarDisplay rating={review.rating} />
                  </div>
                  <p className="review-comment">"{review.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PizzaDetails;