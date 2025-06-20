var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminsRouter = require('./routes/admins');
var categoriesRouter = require('./routes/categories');
var execution_typeRouter = require('./routes/execution_type');
var projectsRouter = require('./routes/projects');
var projectsCategoriesRouter = require('./routes/projects_categories');
var citiesRouter = require('./routes/cities');
var countriesRouter = require('./routes/countries');



var app = express();

app.use(cors());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admins', adminsRouter);
app.use('/categories', categoriesRouter);
app.use('/execution_type', execution_typeRouter);
app.use('/projects', projectsRouter);
app.use('/projects_categories', projectsCategoriesRouter);
app.use('/cities', citiesRouter);
app.use('/countries', countriesRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

// const { sequelize } = require('./models');

// sequelize.sync({ alter: true })  // ⬅️ creates or updates tables without deleting existing ones
//   .then(() => {
//     console.log("✅ Database synced");
//   })
//   .catch(err => console.error("❌ Sync error:", err));




const { sequelize } = require('./models'); // أو المسار المناسب

sequelize.authenticate()
  .then(() => {
    console.log("✅ Connected to the database!");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

