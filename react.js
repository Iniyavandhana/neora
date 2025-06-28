// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    const url = category === 'all' 
      ? 'http://localhost:5000/api/products' 
      : `http://localhost:5000/api/products/category/${category}`;
    const res = await axios.get(url);
    setProducts(res.data);
  };

  const handleLogin = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/login', { email, password });
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
  };

  const handleRegister = async (userData) => {
    const res = await axios.post('http://localhost:5000/api/register', userData);
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
  };

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const placeOrder = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/orders', {
      products: cart.map(item => ({ productId: item._id, quantity: item.quantity }))
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCart([]);
    alert('Order placed successfully!');
  };

  return (
    <div className="app">
      <header>
        <h1>Zepto</h1>
        <p>Delivery in 10 mins</p>
        <div className="search">
          <input type="text" placeholder="Search for products..." />
        </div>
        <nav>
          <button onClick={() => setCategory('fruits')}>Fruits & Veg</button>
          <button onClick={() => setCategory('bakery')}>Bakery</button>
          <button onClick={() => setCategory('beverages')}>Beverages</button>
          <button onClick={() => setCategory('snacks')}>Snacks</button>
        </nav>
      </header>

      <main>
        <section className="deals">
          <h2>Super Saver Deals | Up to 50% OFF</h2>
        </section>

        <section className="recommended">
          <h2>Recommended for you</h2>
          <div className="products">
            {products.map(product => (
              <div key={product._id} className="product-card">
                {product.discount > 0 && (
                  <span className="discount-badge">{product.discount}% OFF</span>
                )}
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.weight}</p>
                <div className="price">
                  <span className="current-price">${product.price}</span>
                  {product.discount > 0 && (
                    <span className="original-price">${product.price * (1 + product.discount/100)}</span>
                  )}
                </div>
                <p className="delivery-time">Delivery in {product.deliveryTime}</p>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="cart">
        <h3>Your Cart ({cart.length})</h3>
        {cart.map(item => (
          <div key={item._id} className="cart-item">
            <span>{item.name}</span>
            <span>${item.price}</span>
          </div>
        ))}
        {cart.length > 0 && (
          <button onClick={placeOrder}>Place Order</button>
        )}
      </div>
    </div>
  );
}

export default App;
