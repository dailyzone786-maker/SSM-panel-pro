import React, { createContext, useState, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { 
  FaHome, FaShoppingBag, FaSignInAlt, FaUserPlus, 
  FaTachometerAlt, FaShoppingCart, FaHistory, FaWallet,
  FaExchangeAlt, FaCode, FaHeadset, FaEnvelope, FaPhone,
  FaInstagram, FaTiktok, FaYoutube, FaFacebook, FaTwitter,
  FaTelegram, FaWhatsapp, FaCopy, FaCheckCircle, FaClock,
  FaSpinner, FaArrowUp, FaRocket, FaShieldAlt, FaUsers,
  FaCog, FaTicketAlt, FaPlus, FaSearch, FaFilter, FaEye,
  FaHeart, FaStar, FaThumbsUp, FaPlay, FaUser, FaLock,
  FaEnvelopeOpen, FaMobile, FaCreditCard, FaUniversity,
  FaMoneyBill, FaArrowLeft, FaArrowRight, FaTimes,
  FaBars, FaMoon, FaSun, FaBell, FaUserCircle
} from 'react-icons/fa';

// =============== CONTEXT ===============
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

// =============== COMPONENTS ===============

// Navbar Component
const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            SMM<span className="text-indigo-600">Panel</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-purple-600">Home</Link>
            <Link to="/services" className="text-gray-700 hover:text-purple-600">Services</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-purple-600">Dashboard</Link>
                <Link to="/new-order" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  New Order
                </Link>
                <div className="flex items-center space-x-2">
                  <FaWallet className="text-purple-600" />
                  <span className="font-semibold">₹{user.balance}</span>
                </div>
                <button onClick={logout} className="text-red-600 hover:text-red-700">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-purple-600">Login</Link>
                <Link to="/register" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Register
                </Link>
              </>
            )}
          </div>
          
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <Link to="/" className="block py-2">Home</Link>
            <Link to="/services" className="block py-2">Services</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block py-2">Dashboard</Link>
                <Link to="/new-order" className="block py-2">New Order</Link>
                <Link to="/orders" className="block py-2">Orders</Link>
                <Link to="/add-funds" className="block py-2">Add Funds</Link>
                <button onClick={logout} className="block py-2 text-red-600">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2">Login</Link>
                <Link to="/register" className="block py-2">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SMM Panel</h3>
            <p className="text-gray-400">Best social media marketing services at cheapest rates.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white">Services</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Payment</h4>
            <p className="text-gray-400">Account: 03124664849</p>
            <p className="text-gray-400">Easypaisa / JazzCash</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <p className="text-gray-400">WhatsApp: 03127773348</p>
            <p className="text-gray-400">24/7 Available</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SMM Panel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Private Route Component
const PrivateRoute = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  
  return children;
};

// =============== PAGES ===============

// Home Page
const Home = () => {
  const services = [
    { icon: FaInstagram, name: 'Instagram', color: 'text-pink-600' },
    { icon: FaTiktok, name: 'TikTok', color: 'text-black' },
    { icon: FaYoutube, name: 'YouTube', color: 'text-red-600' },
    { icon: FaFacebook, name: 'Facebook', color: 'text-blue-600' },
    { icon: FaTwitter, name: 'Twitter', color: 'text-blue-400' },
    { icon: FaTelegram, name: 'Telegram', color: 'text-blue-500' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Grow Your Social Media</h1>
          <p className="text-xl mb-8">Buy real followers, likes & views at best prices</p>
          <Link to="/register" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90">
            Get Started
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {services.map((service, i) => (
              <div key={i} className="bg-white rounded-lg p-6 text-center shadow-md">
                <service.icon className={`text-5xl mx-auto mb-3 ${service.color}`} />
                <h3 className="font-semibold">{service.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Payment Account</h3>
                <p className="text-2xl font-bold text-green-400">03124664849</p>
                <p className="text-gray-400">Easypaisa / JazzCash</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">WhatsApp Support</h3>
                <p className="text-2xl font-bold text-green-400">03127773348</p>
                <p className="text-gray-400">24/7 Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Login Page
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(form.email, form.password);
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account? <Link to="/register" className="text-purple-600">Register</Link>
        </p>
      </div>
    </div>
  );
};

// Register Page
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', whatsapp: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(form);
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({...form, username: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">WhatsApp (Optional)</label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => setForm({...form, whatsapp: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="03XXXXXXXXX"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-purple-600">Login</Link>
        </p>
      </div>
    </div>
  );
};

// Dashboard Page
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, completedOrders: 0, pendingOrders: 0, totalSpent: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        axios.get('/api/orders/my-orders?limit=5'),
        axios.get('/api/users/stats')
      ]);
      setRecentOrders(ordersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <FaCheckCircle className="text-green-500" />;
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'processing': return <FaSpinner className="text-blue-500 animate-spin" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.username}!</h2>
        <p className="text-xl">Balance: ₹{user?.balance}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-600">Total Orders</h3>
            <FaShoppingCart className="text-purple-600 text-xl" />
          </div>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-600">Completed</h3>
            <FaCheckCircle className="text-green-500 text-xl" />
          </div>
          <p className="text-3xl font-bold">{stats.completedOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-600">Pending</h3>
            <FaClock className="text-yellow-500 text-xl" />
          </div>
          <p className="text-3xl font-bold">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-600">Total Spent</h3>
            <FaWallet className="text-purple-600 text-xl" />
          </div>
          <p className="text-3xl font-bold">₹{stats.totalSpent}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link to="/new-order" className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg">
          <FaShoppingCart className="text-4xl text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold">New Order</h3>
        </Link>
        <Link to="/orders" className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg">
          <FaHistory className="text-4xl text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold">Order History</h3>
        </Link>
        <Link to="/add-funds" className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg">
          <FaWallet className="text-4xl text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold">Add Funds</h3>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Service</th>
                <th className="text-left py-3">Quantity</th>
                <th className="text-left py-3">Price</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{order.serviceId?.name}</td>
                  <td className="py-3">{order.quantity}</td>
                  <td className="py-3">₹{order.price}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </td>
                  <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// New Order Page
const NewOrder = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService && quantity) {
      setTotal(selectedService.price * quantity);
    }
  }, [selectedService, quantity]);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      setServices(response.data);
    } catch (error) {
      toast.error('Failed to load services');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedService) {
      toast.error('Please select a service');
      return;
    }

    if (!link) {
      toast.error('Please enter link');
      return;
    }

    if (!quantity || quantity < selectedService.minQuantity || quantity > selectedService.maxQuantity) {
      toast.error(`Quantity must be between ${selectedService.minQuantity} and ${selectedService.maxQuantity}`);
      return;
    }

    if (user.balance < total) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/orders', {
        serviceId: selectedService._id,
        link,
        quantity: parseInt(quantity)
      });
      toast.success('Order placed successfully!');
      setSelectedService(null);
      setLink('');
      setQuantity('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">New Order</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Services List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Select Service</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map(service => (
                <div
                  key={service._id}
                  onClick={() => setSelectedService(service)}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    selectedService?._id === service._id
                      ? 'border-purple-600 bg-purple-50'
                      : 'hover:border-purple-300'
                  }`}
                >
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.category}</p>
                  <p className="text-purple-600 font-bold mt-2">₹{service.price}/-</p>
                  <p className="text-xs text-gray-500">Min: {service.minQuantity} | Max: {service.maxQuantity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Service
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {selectedService ? (
                    <p className="font-medium">{selectedService.name}</p>
                  ) : (
                    <p className="text-gray-500">Select a service</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={selectedService?.minQuantity || 1}
                  max={selectedService?.maxQuantity || 10000}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-purple-600">₹{total}</span>
                </div>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between">
                  <span>Your Balance:</span>
                  <span className="font-bold">₹{user?.balance || 0}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Orders History Page
const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <FaCheckCircle className="text-green-500" />;
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'processing': return <FaSpinner className="text-blue-500 animate-spin" />;
      default: return null;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Service</th>
                <th className="px-6 py-3 text-left">Link</th>
                <th className="px-6 py-3 text-left">Quantity</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">#{order._id.slice(-8)}</td>
                  <td className="px-6 py-4">{order.serviceId?.name}</td>
                  <td className="px-6 py-4">
                    <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline text-sm">
                      {order.link.substring(0, 30)}...
                    </a>
                  </td>
                  <td className="px-6 py-4">{order.quantity}</td>
                  <td className="px-6 py-4">₹{order.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Add Funds Page
const AddFunds = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('easypaisa');
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (amount < 100) {
      toast.error('Minimum amount is ₹100');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/payments/add-funds', {
        amount: parseFloat(amount),
        paymentMethod
      });
      setTransaction(response.data);
      toast.success('Payment request created!');
    } catch (error) {
      toast.error('Failed to create payment request');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add Funds</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Request Payment</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="100"
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="easypaisa"
                    checked={paymentMethod === 'easypaisa'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  Easypaisa
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="jazzcash"
                    checked={paymentMethod === 'jazzcash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  JazzCash
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Generate Request'}
            </button>
          </form>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {transaction ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Payment Instructions</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="font-mono font-bold">{transaction.paymentInstructions.accountNumber}</p>
                  </div>
                  <button onClick={() => copyToClipboard(transaction.paymentInstructions.accountNumber)}>
                    <FaCopy className="text-purple-600" />
                  </button>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-bold text-xl text-purple-600">₹{transaction.transaction?.amount}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-mono">{transaction.transaction?.transactionId}</p>
                </div>
                <a
                  href={`https://wa.me/${transaction.whatsapp}?text=Payment sent of ₹${transaction.transaction?.amount}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
                >
                  <FaWhatsapp />
                  Confirm via WhatsApp
                </a>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Payment Info</h2>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Account</h3>
                  <p className="text-2xl font-bold text-purple-600">03124664849</p>
                  <p className="text-sm text-gray-600">Easypaisa / JazzCash</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Support</h3>
                  <p className="text-2xl font-bold text-green-600">03127773348</p>
                  <p className="text-sm text-gray-600">WhatsApp</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Transactions Page
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/payments/transactions');
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Transaction History</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Transaction ID</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{tx.transactionId}</td>
                  <td className="px-6 py-4 capitalize">{tx.type}</td>
                  <td className={`px-6 py-4 font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{tx.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Services Page
const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      setServices(response.data);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(services.map(s => s.category))];
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Instagram': return <FaInstagram className="text-pink-600" />;
      case 'TikTok': return <FaTiktok className="text-black" />;
      case 'YouTube': return <FaYoutube className="text-red-600" />;
      case 'Facebook': return <FaFacebook className="text-blue-600" />;
      default: return <FaStar className="text-gray-600" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Services</h1>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium capitalize ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div key={service._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              {getCategoryIcon(service.category)}
              <h3 className="text-xl font-semibold">{service.name}</h3>
            </div>
            <p className="text-gray-600 mb-2">{service.category} - {service.type}</p>
            <p className="text-2xl font-bold text-purple-600 mb-4">₹{service.price}/-</p>
            <p className="text-sm text-gray-500 mb-4">Min: {service.minQuantity} | Max: {service.maxQuantity}</p>
            {service.description && (
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            )}
            <Link
              to="/register"
              className="block text-center bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
            >
              Order Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

// Contact Page
const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Get in Touch</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <FaWhatsapp className="text-3xl text-green-500" />
              <div>
                <p className="text-sm text-gray-600">WhatsApp Support</p>
                <p className="font-bold">03127773348</p>
                <p className="text-xs text-gray-500">24/7 Available</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <FaPhone className="text-3xl text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-bold">03124664849</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <FaEnvelope className="text-3xl text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-bold">support@smmpanel.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold mb-2">Easypaisa</h3>
              <p className="text-2xl font-bold text-purple-600">03124664849</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold mb-2">JazzCash</h3>
              <p className="text-2xl font-bold text-purple-600">03124664849</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold mb-2">Bank Transfer</h3>
              <p className="font-bold">SMM Panel Solutions</p>
              <p className="text-sm">Bank Alfalah - 0123456789</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============== AUTH PROVIDER ===============
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// =============== MAIN APP ===============
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/new-order" element={<PrivateRoute><NewOrder /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><OrdersHistory /></PrivateRoute>} />
              <Route path="/add-funds" element={<PrivateRoute><AddFunds /></PrivateRoute>} />
              <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
