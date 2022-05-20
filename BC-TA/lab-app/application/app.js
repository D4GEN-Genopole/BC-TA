const express = require('express');
require('dotenv').config();
const app = express();



// routes
const authRoutes = require('./routes/authRoutes');
const listenerRoutes = require('./routes/listnerRoutes');
const signRoute = require('./routes/signRoute');

// middleware
app.use(express.static('public'));
app.use("/styles",express.static(__dirname + "/views/styles"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use(authRoutes);
app.use(listenerRoutes);
app.use(signRoute);


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// view engine : ejs
app.set('view engine','ejs');

// set up server
const port = process.env.PORT;
if (!module.parent) {
  app.listen(port || 9000 , () => {
  console.log(`Application started on port ${port} ==> http://127.0.0.1:${port}`);});}