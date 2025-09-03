import testSuiteRoutes from './routes/testSuite.js';
// ...existing code...
// Register Test Suite API after app is created and before error handler

import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cookieParser from 'cookie-parser';

// Local modules (make sure these are also using ES module syntax)
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.route.js';
import testPlansRoutes from './routes/testPlans.js';
import testCasesRoutes from './routes/testCases.js';
import testCaseExecutionRoutes from './routes/testCaseExecution.js';
import defectsRoutes from './routes/defects.js';
import usersRoutes from './routes/users.js';
import projectsRoutes from './routes/project.js';
import requirementRoutes from './routes/requirement.js';

dotenv.config();
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Security middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Body parsers
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/testplans', testPlansRoutes);
app.use('/api/testcases', testCasesRoutes);
app.use('/api/defects', defectsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/testcase-execution', testCaseExecutionRoutes);
app.use('/api/testsuites', testSuiteRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'frontend', 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

// Error handler (last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});