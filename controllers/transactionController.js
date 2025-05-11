const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Helper function para verificar propriedade
const checkOwnership = async (transactionId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    const err = new Error('ID de transação inválido');
    err.statusCode = 400;
    throw err;
  }
  
  const transaction = await Transaction.findById(transactionId);
  
  if (!transaction) {
    const err = new Error('Transação não encontrada');
    err.statusCode = 404;
    throw err;
  }
  
  if (transaction.user.toString() !== userId) {
    const err = new Error('Acesso não autorizado a esta transação');
    err.statusCode = 403;
    throw err;
  }
  
  return transaction;
};

// Criação de transação
exports.createTransaction = async (req, res, next) => {
  try {
    const { description, amount, type, category, date } = req.body;

    // Validações
    if (!description || !amount || !type || !category) {
      const err = new Error('Por favor, forneça descrição, valor, tipo e categoria');
      err.statusCode = 400;
      throw err;
    }

    if (!['income', 'expense'].includes(type)) {
      const err = new Error('Tipo deve ser "income" ou "expense"');
      err.statusCode = 400;
      throw err;
    }

    if (typeof amount !== 'number' || amount <= 0) {
      const err = new Error('Valor deve ser um número positivo');
      err.statusCode = 400;
      throw err;
    }

    const newTransaction = await Transaction.create({
      description,
      amount,
      type,
      category,
      date: date || Date.now(),
      user: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: {
        transaction: newTransaction
      }
    });

  } catch (err) {
    next(err);
  }
};

// Listagem de transações com filtros
exports.getAllTransactions = async (req, res, next) => {
  try {
    const filter = { user: req.user.id };
    
    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    
    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    // Paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(filter)
      .skip(skip)
      .limit(limit)
      .sort('-date');

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: transactions.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: {
        transactions
      }
    });

  } catch (err) {
    next(err);
  }
};

// Obter detalhes de uma transação
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await checkOwnership(req.params.id, req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        transaction
      }
    });
  } catch (err) {
    next(err);
  }
};

// Atualização completa da transação
exports.updateTransaction = async (req, res, next) => {
  try {
    await checkOwnership(req.params.id, req.user.id);

    const { description, amount, type, category, date } = req.body;
    
    if (!description || !amount || !type || !category) {
      const err = new Error('Por favor, forneça todos os campos obrigatórios');
      err.statusCode = 400;
      throw err;
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        description,
        amount,
        type,
        category,
        date: date || Date.now()
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        transaction: updatedTransaction
      }
    });

  } catch (err) {
    next(err);
  }
};

// Atualização parcial da transação
exports.partialUpdateTransaction = async (req, res, next) => {
  try {
    await checkOwnership(req.params.id, req.user.id);

    if (req.body.user) {
      const err = new Error('Não é permitido alterar o usuário da transação');
      err.statusCode = 400;
      throw err;
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        transaction: updatedTransaction
      }
    });

  } catch (err) {
    next(err);
  }
};

// Exclusão de transação
exports.deleteTransaction = async (req, res, next) => {
  try {
    await checkOwnership(req.params.id, req.user.id);
    
    await Transaction.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
      message: 'Transação excluída com sucesso'
    });

  } catch (err) {
    next(err);
  }
};

// Estatísticas das transações
exports.getTransactionStats = async (req, res, next) => {
  try {
    const stats = await Transaction.aggregate([
      {
        $match: { user: mongoose.Types.ObjectId(req.user.id) }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          avgAmount: { $avg: '$amount' },
          minAmount: { $min: '$amount' },
          maxAmount: { $max: '$amount' }
        }
      }
    ]);

    const byCategory = await Transaction.aggregate([
      {
        $match: { user: mongoose.Types.ObjectId(req.user.id) }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        byCategory
      }
    });

  } catch (err) {
    next(err);
  }
};