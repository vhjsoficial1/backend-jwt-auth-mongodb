module.exports = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
    
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: 'Duplicate field value entered'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  };