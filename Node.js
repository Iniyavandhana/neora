// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/zepto', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Models
const User = mongoose.model('User', {
  name: String,
  email: { type: String, unique: true },
  password: String,
  address: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  }
});

const Product = mongoose.model('Product', {
  name: String,
  category: String,
  price: Number,
  discount: Number,
  weight: String,
  deliveryTime: { type: String, default: '10 min' },
  image: String
});

const Order = mongoose.model('Order', {
  userId: mongoose.Schema.Types.ObjectId,
  products: [{
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number
  }],
  status: { type: String, default: 'pending' },
  deliveryTime: String,
  createdAt: { type: Date, default: Date.now }
});

// Middleware
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied');

  try {
    const decoded = jwt.verify(token, 'zepto_secret');
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, 'zepto_secret');
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !await bcrypt.compare(req.body.password, user.password)) {
    return res.status(400).send('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, 'zepto_secret');
  res.send({ user, token });
});

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

app.get('/api/products/category/:category', async (req, res) => {
  const products = await Product.find({ category: req.params.category });
  res.send(products);
});

app.post('/api/orders', authenticate, async (req, res) => {
  const order = new Order({ ...req.body, userId: req.user._id });
  await order.save();
  res.send(order);
});

app.get('/api/orders', authenticate, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).populate('products.productId');
  res.send(orders);
});

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
