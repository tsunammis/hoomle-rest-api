'use strict';

var objectHelper    = require('../helpers/object'),
    httpErrors      = require('../helpers/http.errors'),
    userDao         = require('../manager/dao').User,
    userManager     = require('../manager').User,
    stringValidator = require('../validator').String,
    errors          = require('../validator').Errors,
    NotFoundBim     = require('../bim/notFoundBim'),
    errorHandler    = require('./default').errorHandler,
    when            = require('when'),
    _               = require('lodash');

/**
 * GET  /users/:id
 *
 * Parameters:
 *  - id | Respect the format of Mongo's Id
 *
 * @param {Request} req
 * @param {Response} res
 */
var show = function(req, res) {
    console.log('controller:users:show');

    stringValidator.isDocumentId(req.params.id)
        .then(function(value) {
            return userDao.findOneReadOnlyById(value);
        })
        .then(function(data) {
            if (!data) {
                return when.reject(new NotFoundBim(
                    errors.user.not_found.code,
                    errors.user.not_found.message
                ));
            }
            data = objectHelper.removeProperties(['__v', 'password'], data);
            res
                .contentType('application/json')
                .send(JSON.stringify(data));
        }).then(null, function(err) {
            errorHandler(err, req, res);
        });
};

/**
 * POST  /users
 *
 * Request payload:
 *  {
 *      email: "stanislas.chollet@gmail.com",
 *      password: "0000",
 *      displayName: "Stan Chollet"
 *  }
 *
 * @param {Request} req
 * @param {Response} res
 */
var create = function(req, res) {
    console.log('controller:users:create');

    userManager
        .create(req.body)
        .then(function(resolved) {
            res
                .contentType('application/json')
                .status(201)
                .send(JSON.stringify(resolved.value));
        }, function(err) {
            res
                .contentType('application/json')
                .status(err.bim.status)
                .send(err.bim.render('json'));
        });
};

module.exports = {
    show: show,
    create: create
};
