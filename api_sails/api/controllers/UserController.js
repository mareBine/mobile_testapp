/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    // primer custom sql stavka z parametrom
    // dostop z /user/sql
    sql: function (req, res) {
        console.log(req.params);
        User.query('SELECT * FROM user WHERE id = ?', [req.params.id], function (err, results) {
            if (err) return res.serverError(err);
            return res.ok(results);
        });
    },

    // primer za socket povezavo
    // niti se ne rabi, ker vse to vsebuje že default blueprint
    // dostop z /user/testsocket
    testsocket: function (req, res) {

        var data_from_client = req.params.all();

        if (req.isSocket && req.method === 'POST') {

            //console.log('testsocket POST', data_from_client);

            // This is the message from connected client;
            User.create(data_from_client).exec(function (error, response) {
                console.log('testsocket response');
                User.publishCreate(response);
            });
        }

        else if (req.isSocket) {
            // subscribe client to model changes
            User.watch(req.socket);
            console.log('User subscribed to ' + req.socket.id);
        }

        // samo zato da v Postmanu nekaj vrne nazaj
        else {
            res.ok({response: 'not saved', data: data_from_client});
        }

    }
};

