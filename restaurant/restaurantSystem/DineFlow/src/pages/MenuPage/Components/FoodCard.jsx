import React from "react";
import { useCart } from "../../../context/CartContext.jsx";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import "../../../style/MenuPage/FoodCard.css";
import CategoryBadge from "./CategoryBadge.jsx";

const FoodCard = ({ item, onQuickView, onAddToCart }) => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate(); // 2. Initialize navigate

  // Check if item is in cart
  const itemId = item._id || item.id;
  const cartItem = cartItems.find((cartItem) => (cartItem._id || cartItem.id) === itemId);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // 3. Helper function to check login
  const checkAuthAndExecute = (action) => {
    const token = localStorage.getItem("token"); // Or use your AuthContext status
    if (!token) {
      alert("Please login to add items to your cart!");
      navigate("/login"); // Adjust the path to your login route
      return;
    }
    action();
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    checkAuthAndExecute(() => {
      if (quantityInCart === 0) {
        onAddToCart(item);
      } else {
        updateQuantity(itemId, quantityInCart + 1);
      }
    });
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    checkAuthAndExecute(() => {
      if (quantityInCart === 1) {
        removeFromCart(itemId);
      } else {
        updateQuantity(itemId, quantityInCart - 1);
      }
    });
  };

  return (
    <div className="food-card">
      <div className="food-card-image-container">
        <img 
          src={item.image} 
          alt={item.name} 
          className="food-card-image" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWMwhobRzD-KYHVyo70XCKsSDYfszVx9ZFig&s';
          }}
        />
        <div className="food-card-badge">
          <CategoryBadge category={item.category} />
        </div>
        <div className="food-card-rating">
          <span className="star-icon">★</span>
          <span className="rating-text">{item.rating}</span>
        </div>
        {quantityInCart > 0 && (
          <div className="food-card-in-cart-badge">
            <ShoppingCart size={14} />
            <span>{quantityInCart}</span>
          </div>
        )}
      </div>

      <div className="food-card-content">
        <h3 className="food-card-title">{item.name}</h3>
        <p className="food-card-description">{item.description}</p>

        <div className="food-card-footer">
          <span className="food-card-price">₹{item.price}</span>
        </div>

        <div className="food-card-actions">
          {quantityInCart === 0 ? (
            <button 
              onClick={handleIncrease} // Updated to use the check
              className="btn-add-cart"
            >
              <ShoppingCart size={18} color="white"/>
              Add to Cart
            </button>
          ) : (
            <div className="quantity-controls">
              <button 
                onClick={handleDecrease} 
                className="quantity-btn quantity-btn-decrease"
              >
                <Minus size={16} />
              </button>
              <span className="quantity-display">{quantityInCart}</span>
              <button 
                onClick={handleIncrease} 
                className="quantity-btn quantity-btn-increase"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
          <button onClick={() => onQuickView(item)} className="btn-quick-view">
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;