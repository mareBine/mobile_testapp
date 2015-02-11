/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

// v config/models.js sem dal autoPK: true kar pomeni, da samo doda polje id, autoinc

//        id: {
//            type: 'integer',
//            autoIncrement: true,
//            primaryKey: true
//        },
        username: {
            type: 'string'
        },
        password: {
            type: 'string'
        }
    }
};

