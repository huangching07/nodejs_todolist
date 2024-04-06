const headers = require('./resHeader');

const SuccessHandler = (res, hasData, data) => {
  res.writeHead(200, headers);
  if(hasData){
    res.write(JSON.stringify({
      'status': 'success',
      'data': data
    }));
  }
  res.end();
}

module.exports = SuccessHandler;