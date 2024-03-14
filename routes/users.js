var express = require('express');
var router = express.Router();
var _ = require('lodash');
var logger = require('../lib/logger');
var log = logger();

var users = require('../init_data.json').data;
var curId = _.size(users);

const path = require("path");

/* GET users listing. */
router.get('/', function(req, res) {
  res.json(_.toArray(users));
});

/* GET admin page */
router.get('/admin.html', function (req, res) {
  res.sendFile('admin.html', {root: __dirname + '/../public'});
});

/* Create a new user */
router.post('/', function(req, res) {
  // var user = req.body;
  var user = {
    id: curId++,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    state: "pending"
  }

  users[user.id] = user;
  log.info('Created user', user);
  res.redirect('/');
});

/* Get a specific user by id */
router.get('/:id', function(req, res, next) {
  var user = users[req.params.id];
  if (!user) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../public/user.html'));
});

/* Delete a user by id */
router.delete('/:id', function(req, res) {
  var user = users[req.params.id];
  delete users[req.params.id];
  res.status(204);
  log.info('Deleted user', user);
  res.json(user);
});

/* Update a user by id */
router.put('/:id', function(req, res, next) {
  var user = req.body;
  if (user.id != req.params.id) {
    return next(new Error('ID paramter does not match body'));
  }
  users[user.id] = user;
  log.info('Updating user', user);
  res.json(user);
});


module.exports = router;
