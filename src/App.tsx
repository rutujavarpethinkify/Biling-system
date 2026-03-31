import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { products, calculateBill } from './utils/billing';
import { RootState } from './app/store';
import { increment, decrement, setQuantity, clear } from './features/cartSlice';

function formatMoney(value: number) {
  return `£${value.toFixed(2)}`;
}

function App() {
  const quantities = useSelector((state: RootState) => state.cart.quantities);
  const dispatch = useDispatch();

  const billing = useMemo(() => calculateBill(quantities), [quantities]);

  return (
    <div className="app-container">
      <header>
        <center><h1>Billing System</h1></center>
        
      </header>

      <main>
        <section className="products">
          <h2>Products</h2>
          <ul>
            {products.map((product) => {
              const qty = quantities[product.id] || 0;
              return (
                <li key={product.id}>
                  <div>
                    <strong>{product.name}</strong> - {formatMoney(product.price)}
                    <div className="qty-controls">
                      <button onClick={() => dispatch(decrement(product.id))} disabled={qty === 0}>
                        -
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={qty}
                        onChange={(e) => dispatch(setQuantity({ productId: product.id, quantity: Number(e.target.value) }))}
                      />
                      <button onClick={() => dispatch(increment(product.id))}>+</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <button className="clear-btn" onClick={() => dispatch(clear())}>
            Clear Selection
          </button>
        </section>

        <section className="summary">
          <h2>Bill Summary</h2>
          <div className="bill-row">
            <span>Subtotal</span>
            <span>{formatMoney(billing.subtotal)}</span>
          </div>
          <div className="bill-row">
            <span>Special offers</span>
            <span>{formatMoney(billing.discounts)}</span>
          </div>

          {billing.savings.length > 0 ? (
            <div className="offers-review">
              <h3>Offers Applied</h3>
              <ul>
                {billing.savings.map((offer) => (
                  <li key={offer.id}>
                    {offer.description}: saved {formatMoney(offer.saving)}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="offers-review no-offers">No offers are currently applied.</div>
          )}

          <div className="bill-row total">
            <span>Final total</span>
            <span>{formatMoney(billing.finalTotal)}</span>
          </div>

          <div className="savings-detail">
            <span>Saved</span>
            <span>{formatMoney(billing.discounts)}</span>
          </div>
        </section>
      </main>

      <footer>
        <em>Offers: Cheese BOGO, Soup &gt; Bread 50% off, Butter 33% off</em>
      </footer>
    </div>
  );
}

export default App;
