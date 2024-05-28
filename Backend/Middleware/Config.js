// config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_LIVE_KEY,
  PORT: process.env.PORT || 3000,
  CALLBACK_URL: process.env.CALLBACK_URL || 'http://localhost:5174/cart'
};
