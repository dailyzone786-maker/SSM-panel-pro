const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// =============== MODELS ===============
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  balance: { type: Number, default: 0 },
  role: { type: String, default: 'user' },
  whatsapp: String,
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

const serviceSchema = new mongoose.Schema({
  name: String,
  category: String,
  type: String,
  price: Number,
  minQuantity: Number,
  maxQuantity: Number,
  description: String,
  providerServiceId: String,
  isActive: { type: Boolean, default: true }
});

const Service = mongoose.model('Service', serviceSchema);

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  link: String,
  quantity: Number,
  price: Number,
  status: { type: String, default: 'pending' },
  providerOrderId: String,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  amount: Number,
  status: { type: String, default: 'pending' },
  paymentMethod: String,
  transactionId: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// =============== MIDDLEWARE ===============
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error();
    
    req.userId = user._id;
    req.userRole = user.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// =============== ROUTES ===============

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, whatsapp } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({ username, email, password, whatsapp });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Services Routes
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Orders Routes
app.post('/api/orders', auth, async (req, res) => {
  try {
    const { serviceId, link, quantity } = req.body;
    
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(400).json({ message: 'Service not found' });
    }
    
    const price = service.price * quantity;
    
    const user = await User.findById(req.userId);
    if (user.balance < price) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    const order = new Order({
      userId: req.userId,
      serviceId,
      link,
      quantity,
      price
    });
    
    await order.save();
    
    user.balance -= price;
    await user.save();
    
    const transaction = new Transaction({
      userId: req.userId,
      type: 'order_payment',
      amount: -price,
      status: 'completed',
      description: `Order #${order._id}`
    });
    await transaction.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('serviceId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Payments Routes
app.get('/api/payments/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/payments/add-funds', auth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    const transaction = new Transaction({
      userId: req.userId,
      type: 'deposit',
      amount,
      paymentMethod,
      transactionId: `TXN${Date.now()}`
    });
    
    await transaction.save();
    
    res.json({
      transaction,
      paymentInstructions: {
        accountNumber: '03124664849',
        accountTitle: 'SMM Panel',
        bank: 'Easypaisa/JazzCash'
      },
      whatsapp: '03127773348'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User Routes
app.get('/api/users/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users/stats', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId });
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalSpent = orders.reduce((sum, o) => sum + o.price, 0);
    
    res.json({ totalOrders, completedOrders, pendingOrders, totalSpent });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
