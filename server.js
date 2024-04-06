const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandler = require('./errorHandler');
const successHandler = require('./successHandler');
const todos = [];

const requestListener = (req, res) => {
  // 取得所有待辦事項
  if(req.url == '/todos' && req.method == 'GET'){
    successHandler(res, true, todos);
  }
  // 新增單筆待辦事項
  else if(req.url == '/todos' && req.method == 'POST'){
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try{
        const title = JSON.parse(body).title;
        if(title !== undefined){
          const todo = {
            'title': title,
            'id': uuidv4()
          };
          todos.push(todo);
          successHandler(res, true, todos);
        }
        else{
          errorHandler(res, 400, '欄位未填寫正確');
        }
      }
      catch(error){
        errorHandler(res, 400, '欄位未填寫正確');
      }
    });
  }
  // 刪除所有代辦事項
  else if(req.url == '/todos' && req.method == 'DELETE'){
    todos.length = 0;
    successHandler(res, true, todos);
  }
  // 刪除單筆待辦事項
  else if(req.url.startsWith('/todos/') && req.method == 'DELETE'){
    const id = req.url.split('/').pop();
    const index = todos.findIndex(element => element.id == id);
    if(index !== -1){
      todos.splice(index, 1);
      successHandler(res, true, todos);
    }
    else{
      errorHandler(res, 400, '沒有這筆待辦事項');
    }
  }
  // 更新單筆待辦事項
  else if(req.url.startsWith('/todos/') && req.method == 'PATCH'){
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try{
        const newTitle = JSON.parse(body).title;
        if(newTitle !== undefined){
          const id = req.url.split('/').pop();
          const index = todos.findIndex(element => element.id == id);
          if(index !== -1){
            todos[index].title = newTitle;
            successHandler(res, true, todos);
          }
          else{
            errorHandler(res, 400, '沒有這筆代辦事項');
          }
        }
        else{
          errorHandler(res, 400, '欄位未填寫正確');
        }
      }
      catch(err){
        errorHandler(res, 400, '欄位未填寫正確');
      }
    })
  }
  // preflight
  else if(req.method == 'OPTIONS'){
    successHandler(res, false);
  }
  // 不符合所有條件
  else{
    errorHandler(res, 404, '無此網站路由')
  }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);