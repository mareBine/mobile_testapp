var express = require('express');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');           // ORM modul za mysql, postgre, ...
var http = require('http');
var restful = require('sequelize-restful');     // rest modul za sequelize; unmaintained, priporoča epilogue
var rest = require('epilogue');                 // rest modul za sequelize; ne podpira asociacij
var crypto = require('crypto');
var cors = require('cors');                     // da dovoli cross origin requests

// db config - da bere iz fajle database.json
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
//sequelize
//    .authenticate()
//    .complete(function (err) {
//        if (!!err) {
//            console.log('Unable to connect to the database:', err)
//        } else {
//            console.log('Connection has been established successfully.')
//        }
//    });

var app = express();

var port = process.env.PORT || 8080;

// cors; middleware for dynamically or statically enabling CORS in express/connect applications
// brez tega dobivaš na angular strani Access-Control-Allow-Origin errorje
// z origin lahko omejiš iz kje je dovoljen dostop
app.use(cors({
    //origin: 'http://192.168.43.119'
    //origin: 'http://127.0.0.1:8100'
}));


// Use the body-parser package in our application
// The body parser will let us parse the url-encoded http requests
// The "extended" syntax allows for rich objects and arrays to be encoded into
// the urlencoded format, allowing for a JSON-like experience with urlencoded.
app.use(bodyParser.urlencoded({
    extended: true
}));


/////////////////////////////////
// Sequelize MODELS
/////////////////////////////////
var User = sequelize.define('users', {
    username: Sequelize.STRING,
    password: Sequelize.STRING
}, {
    // tukaj lahko določiš metode (get, post, ...), ki jih potem kličeš iz rout
    instanceMethods: {}
});

var Project = sequelize.define('projects', {
        name: Sequelize.STRING
    }
);

// asociacije
User.hasMany(Project, {foreignKey: 'user_id' });

/////////////////////////////////
// sequelize-restful zgradi route; podpira asociacije
/////////////////////////////////
app.use(restful(sequelize, {
    // Parameter:   endpoint
    // Description: Define the path to the restful API.
    // Default:     '/api'
    //endpoint: '/restful',

    // Parameter:   allowed
    // Description: Define which models will be exposed through the restful API
    // Default:     'new Array()' if it is an Empty array, all the models will be exposed by default
    //allowed: new Array('Model0', 'Model1', 'Model2')
}));


/////////////////////////////////
// epilogue rest - zgradi route; podpira sort, limit, nima asociacij
/////////////////////////////////
rest.initialize({
    app: app,
    base: '/rest',
    sequelize: sequelize
});

var users = rest.resource({
    model: User,
    endpoints: ['/users', '/users/:id']
});

var projects = rest.resource({
    model: Project,
    endpoints: ['/projects', '/projects/:id']
});

///////////////////////////////////
// manualne route
///////////////////////////////////
var router = express.Router();
router.route('/users')
    // primer za insert userja, password zakodiran z uporabo hash funkcije
    .post(function (req, res) {

        var username = req.body.username; //bodyParser does the magic
        var password = req.body.password;

        var shasum = crypto.createHash('sha1');
        shasum.update(password);
        password = shasum.digest('hex');

        User.build({ username: username, password: password })
            .save().then(function(success) {
                res.json({ message: 'User ' + username + ' created!' });
            }).catch(function(error) {
                res.send(error);
            });
    });


router.route('/users/:user_id')
    // primer za custom select stavek
    .get(function (req, res) {

        //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        var user = User.build();

        sequelize.query('SELECT * FROM users WHERE id = :id', null, { raw: true }, { id: req.params.user_id })
                .then(function(success) {
                res.json(success);
            }).catch(function(error) {
                res.send(err);
            });

    });

app.use('/manual', router);

//////////////////////////////////////
// Middleware to use for all requests
//////////////////////////////////////
//router.use(function (req, res, next) {
//    // do logging
//    console.log('Something is happening.');
//    next();
//});


// start serverja
//app.listen(port);
http.createServer(app).listen(port, function () {
    console.log("Express server listening on port " + port)
});