const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zepto';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  deliveryAddress: { type: String, required: true },
  deliveryLocation: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  estimatedDeliveryTime: Date,
  createdAt: { type: Date, default: Date.now }
});

OrderSchema.index({ deliveryLocation: '2dsphere' });

const Order = mongoose.model('Order', OrderSchema);

// Auth Middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
  }
};

// Routes

// @route   POST /api/auth/register
// @desc    Register a new user
app.post('/api/auth/register', [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  body('phone', 'Phone number is required').not().isEmpty(),
  body('address', 'Address is required').not().isEmpty(),
  body('location', 'Location is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phone, address, location } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      phone,
      address,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      }
    });

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({ success: true, token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
app.post('/api/auth/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({ success: true, token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
app.post('/api/orders', protect, async (req, res) => {
  const { items, deliveryAddress, deliveryLocation, totalAmount } = req.body;

  try {
    const order = new Order({
      user: req.user.id,
      items,
      deliveryAddress,
      deliveryLocation: {
        type: 'Point',
        coordinates: deliveryLocation.coordinates
      },
      totalAmount
    });

    await order.save();

    // In a real app, you would:
    // 1. Find nearest available delivery partner
    // 2. Assign to order
    // 3. Update order status
    // 4. Send notifications

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
app.get('/api/orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
app.get('/api/orders/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user deliveryPartner');

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Check if user owns the order or is the delivery partner
    if (order.user._id.toString() !== req.user.id && 
        (order.deliveryPartner && order.deliveryPartner._id.toString() !== req.user.id)) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
app.put('/api/orders/:id/status', protect, async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Check if user is the delivery partner or admin
    if (order.deliveryPartner && order.deliveryPartner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, data: order });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
