const headers = require('./resHeader');

function errorHandler(res, errorCode, errorMessage){
  res.writeHead(errorCode, headers);
  res.write(JSON.stringify({
    'status': 'fail',
    'message': errorMessage
  }));
  res.end();
}

module.exports = errorHandler;