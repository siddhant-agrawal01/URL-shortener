const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API routes for dashboard & analytics
app.use('/api/url', require('./routes/urlRoutes'));

// Public redirect route (must be separate!)
app.use('/short', require('./routes/redirectRoutes')); // ✅ IMPORTANT

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
