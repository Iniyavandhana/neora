// server.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String,
  stock: Number,
});

module.exports = mongoose.model('Product', productSchema);

// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);

// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
    },
  ],
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);

// controllers/productController.js
const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.createProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  const saved = await newProduct.save();
  res.status(201).json(saved);
};

// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  const saved = await user.save();
  res.status(201).json(saved);
};

// controllers/orderController.js
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  const newOrder = new Order(req.body);
  const saved = await newOrder.save();
  res.status(201).json(saved);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find().populate('userId').populate('products.productId');
  res.json(orders);
};

// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct } = require('../controllers/productController');

router.get('/', getAllProducts);
router.post('/', createProduct);

module.exports = router;

// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { register } = require('../controllers/userController');

router.post('/register', register);

module.exports = router;

// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getOrders);

module.exports = router;
