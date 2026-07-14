import { useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/CartContext';

/** Sticky bottom bar showing the current selection; continues to checkout. */
export function CartBar() {
  const { count, total } = useCart();
  const navigate = useNavigate();

  if (count === 0) return null;

  return (
    <div className="cart-bar">
      <div className="cart-bar-inner">
        <div className="cart-info">
          <span className="cart-count">{count} service{count > 1 ? 's' : ''} selected</span>
          <span className="cart-total">₹{total}</span>
        </div>
        <button className="btn-primary" onClick={() => navigate('/checkout')}>
          Continue to checkout
        </button>
      </div>
    </div>
  );
}
