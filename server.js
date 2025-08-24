const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.route.js'));
app.use('/api/auth', require('./routes/resetPassword'));
app.use('/api/testplans', require('./routes/testPlans'));
app.use('/api/testcases', require('./routes/testCases'));
app.use('/api/defects', require('./routes/defects'));
app.use('/api/users', require('./routes/users'));

// Error handler (last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
