let express = require('express');
// var http=require("http");  

let chain = require('./src/api/chain');
let server = require('./src/api/server');


let app = express();

// var server = http.createServer(function(request, response) {  
//     response.writeHead(200, {  
//         'Content-Type': 'text/plain'  
//     }); 
    
//     let j = 1000
//     response.write("This is Test Message.\n"+j); 
//     response.end();  
// }); 
// server.listen(8080);  


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');


// app.use(bodyParser.urlencoded({ extended: true }));


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/chain', chain)
app.use('/server', server)





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
