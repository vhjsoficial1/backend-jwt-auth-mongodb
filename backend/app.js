const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas
app.use('/api/protected', protectedRoutes);
app.use('/api/transactions', transactionRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Finance API',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      transactions: {
        create: 'POST /api/transactions',
        list: 'GET /api/transactions',
        stats: 'GET /api/transactions/stats',
        detail: 'GET /api/transactions/:id',
        update: 'PUT /api/transactions/:id',
        partialUpdate: 'PATCH /api/transactions/:id',
        delete: 'DELETE /api/transactions/:id'
      }
    }
  });
});

// Rota não encontrada
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;