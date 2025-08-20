const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// ✅ Load .env variables first
dotenv.config();

// ✅ Initialize Stripe after loading env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Gitpod-compatible CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.includes('.gitpod.io')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}));

// ✅ Handle preflight OPTIONS
app.options('*', cors());

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Checkout route
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid cart data' });
    }

    const line_items = items.map(item => ({
      price_data: {
        currency: 'huf',
        product_data: {
          name: item.title,
          images: [item.imageUrls?.[0] || ''],
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe session error:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
