import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "../../../style/MenuPage/QuickViewModal.css";
import CategoryBadge from "./CategoryBadge";
import { FaClock, FaStar, FaFire } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export default function QuickViewModal({ item, onClose, onAddToCart }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (!item) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, handleKeyDown]);

  if (!item) return null;

  return createPortal(
    <div className="qv-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="qv-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* LEFT SIDE: IMAGE */}
        <div className="qv-image-side">
          <img 
            src={item.image} 
            alt={item.name}
            className="qv-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          <button className="qv-close-btn" onClick={onClose} aria-label="Close">
            <IoClose size={22} />
          </button>
          {item.category && (
            <div className="qv-badge-container">
              <CategoryBadge category={item.category} />
            </div>
          )}
        </div>

        {/* RIGHT SIDE: CONTENT */}
        <div className="qv-info-side">
          <div className="qv-top-content">
            <div className="qv-header">
              <h2 className="qv-title">{item.name}</h2>
              <span className="qv-price-tag">₹{item.price}</span>
            </div>

            <div className="qv-scroll-area">
              <p className="qv-description-text">{item.description}</p>

              <div className="qv-metrics">
                <div className="qv-metric-pill">
                  <FaStar color="#ffc107" size={14} /> 
                  <span>{item.rating || "4.5"}</span>
                </div>
                <div className="qv-metric-pill">
                  <FaClock color="#666" size={14} /> 
                  <span>{item.prepTime || '20 min'}</span>
                </div>
                <div className="qv-metric-pill">
                  <FaFire color="#ff5e3a" size={14} /> 
                  <span>{item.calories || '250'} cal</span>
                </div>
              </div>

              <div className="qv-chef-notes">
                <p><strong>🍽️ Perfect for:</strong> {item.category || 'Desserts'}</p>
                <p style={{ marginTop: '8px' }}>
                  <strong>👨‍🍳 Chef's Note:</strong> Freshly prepared with authentic ingredients and signature spices.
                </p>
              </div>
            </div>
          </div>

          {/* FIXED BOTTOM ACTION */}
          <button
            className="qv-submit-btn"
            onClick={() => {
              onAddToCart(item);
              onClose();
            }}
          >
            Add to Cart – ₹{item.price}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}