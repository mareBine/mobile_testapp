/**
 * Created by mare on 5.2.2015.
 *
 * api nodejs server
 */

// We load the required packages
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var passport = require('passport');

var dataController = require('./controllers/data');

// Create our Express application
var app = express();

// Connect to the mysql database
/*
 var mysqlConn = mysql.createConnection({
 host     : 'localhost',
 port     : 3308,
 user     : 'root',
 password : 'redhat',
 database : 'test'
 });

 mysqlConn.connect();
 */

// Use the body-parser package in our application
// The body parser will let us parse the url-encoded http requests
// The "extended" syntax allows for rich objects and arrays to be encoded into
// the urlencoded format, allowing for a JSON-like experience with urlencoded.
app.use(bodyParser.urlencoded({
    extended: true
}));

// Create our router that will route the requests to the corresponding ressources
var router = express.Router();

// Create endpoint handlers for /locations
router.route('/users')
    // create a user (accessed at POST http://localhost:8080/api/users)
    .post(function (req, res) {

        var username = req.body.username; //bodyParser does the magic
        var password = req.body.password;

        var user = User.build({ username: username, password: password });

        user.add(function (success) {
                res.json({ message: 'User ' + username + ' created!' });
            },
            function (err) {
                res.send(err);
            });
    })
    // get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function (req, res) {
        var user = User.build();

        user.retrieveAll(function (users) {
            if (users) {
                res.json(users);
            } else {
                res.status(status).send(401, "User not found");
            }
        }, function (error) {
            res.send("User not found");
        });
    });

router.route('/users/:user_id')
    // get a user by id(accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function (req, res) {
        var user = User.build();

        user.retrieveById(req.params.user_id, function (users) {
            if (users) {
                res.json(users);
            } else {
                res.status(401).send("User not found");
            }
        }, function (error) {
            res.send("User not found");
        });
    })
    // update a user (accessed at PUT http://localhost:8080/api/users/:user_id)
    .put(function (req, res) {
        var user = User.build();

        user.username = req.body.username;
        user.password = req.body.password;

        user.updateById(req.params.user_id, function (success) {
            console.log(success);
            if (success > 0) {
                res.json({ message: 'User ' + req.params.user_id + ' updated!' });
            } else {
                res.status(401).send("User " + req.params.user_id + " not found");
            }
        }, function (error) {
            res.status(400).send("User not found" + error);
        });
    })
    // delete a user by id (accessed at DELETE http://localhost:8080/api/users/:user_id)
    .delete(function (req, res) {
        var user = User.build();

        user.removeById(req.params.user_id, function (users) {
            if (users) {
                res.json({ message: 'User removed!' });
            } else {
                res.status(401).send("User not found");
            }
        }, function (error) {
            res.status(401).send("User not found");
        });
    });

// Middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// We tell our app to use our router with the api prefix
app.use('/api', router);

// We start the server by listening to port 8080
app.listen(process.env.PORT || 8080);

console.log("server is running");


// mysql query
/*
 mysqlConn.query('SELECT * FROM customers', function(err, rows, fields) {
 if (err) throw err;

 console.log('rows: ', rows);
 console.log('fields: ', fields);
 });
 mysqlConn.end();
 */


// IMPORT MODELS
// =============================================================================
var Sequelize = require('sequelize');

// db config
var env = "dev";
var config = require('./database.json')[env];
var password = config.password ? config.password : null;

// initialize database connection
var sequelize = new Sequelize(
    config.database,
    config.user,
    config.password,
    {
        dialect: "mysql",
        port: 3308,
        logging: console.log,
        define: {
            timestamps: false
        }
    }
);

// testiranje povezave na bazo
sequelize
    .authenticate()
    .complete(function (err) {
        if (!!err) {
            console.log('Unable to connect to the database:', err)
        } else {
            console.log('Connection has been established successfully.')
        }
    });

var crypto = require('crypto');
var DataTypes = require("sequelize");

// -------------------------
// MODEL: User
// -------------------------
var User = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
}, {
    instanceMethods: {
        retrieveAll: function (onSuccess, onError) {
            console.log('retrieveAll');
            User.findAll({}, {raw: true})
                .then(onSuccess).catch(onError);
        },
        retrieveById: function (user_id, onSuccess, onError) {
            console.log('retrieveById');
            User.find({where: {id: user_id}}, {raw: true})
                .then(onSuccess).catch(onError);
        },
        add: function (onSuccess, onError) {
            var username = this.username;
            var password = this.password;

            var shasum = crypto.createHash('sha1');
            shasum.update(password);
            password = shasum.digest('hex');

            User.build({ username: username, password: password })
                .save().then(onSuccess).catch(onError);
        },
        updateById: function (user_id, onSuccess, onError) {
            var id = user_id;
            var username = this.username;
            var password = this.password;

            var shasum = crypto.createHash('sha1');
            shasum.update(password);
            password = shasum.digest('hex');

            User.update({ username: username, password: password}, {where: {id: id} })
                .then(onSuccess).catch(onError);
        },
        removeById: function (user_id, onSuccess, onError) {
            User.destroy({where: {id: user_id}}).then(onSuccess).catch(onError);
        }
    }
});
